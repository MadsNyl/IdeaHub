"use client";

import { Loader2, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { authClient } from "~/server/better-auth/client";

interface Session {
	id: string;
	token: string;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	expiresAt: Date;
}

interface SessionCardProps {
	session: Session;
	isCurrentSession: boolean;
}

function parseUserAgent(userAgent: string | null): {
	browser: string;
	device: string;
	icon: typeof Monitor;
} {
	if (!userAgent) {
		return {
			browser: "Unknown browser",
			device: "Unknown device",
			icon: Monitor,
		};
	}

	const ua = userAgent.toLowerCase();

	// Detect device type
	let device = "Desktop";
	let icon = Monitor;
	if (ua.includes("mobile") || ua.includes("android")) {
		device = "Mobile";
		icon = Smartphone;
	} else if (ua.includes("tablet") || ua.includes("ipad")) {
		device = "Tablet";
		icon = Tablet;
	}

	// Detect browser
	let browser = "Unknown browser";
	if (ua.includes("firefox")) {
		browser = "Firefox";
	} else if (ua.includes("edg/")) {
		browser = "Edge";
	} else if (ua.includes("chrome")) {
		browser = "Chrome";
	} else if (ua.includes("safari")) {
		browser = "Safari";
	} else if (ua.includes("opera") || ua.includes("opr/")) {
		browser = "Opera";
	}

	// Detect OS
	let os = "";
	if (ua.includes("windows")) {
		os = "Windows";
	} else if (ua.includes("mac os")) {
		os = "macOS";
	} else if (ua.includes("linux")) {
		os = "Linux";
	} else if (ua.includes("android")) {
		os = "Android";
	} else if (ua.includes("iphone") || ua.includes("ipad")) {
		os = "iOS";
	}

	return {
		browser: os ? `${browser} on ${os}` : browser,
		device,
		icon,
	};
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(date));
}

export function SessionCard({ session, isCurrentSession }: SessionCardProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const { browser, icon: DeviceIcon } = parseUserAgent(session.userAgent);

	const handleRevoke = async () => {
		setLoading(true);
		try {
			const result = await authClient.revokeSession({ token: session.token });

			if (result.error) {
				toast.error(result.error.message ?? "Failed to revoke session");
				return;
			}

			toast.success("Session revoked");
			router.refresh();
		} catch {
			toast.error("Failed to revoke session");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<DeviceIcon className="h-5 w-5 text-primary" />
				</div>
				<div>
					<div className="flex items-center gap-2">
						<p className="font-medium">{browser}</p>
						{isCurrentSession && (
							<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500 text-xs">
								Current
							</span>
						)}
					</div>
					<p className="text-muted-foreground text-sm">
						{session.ipAddress ?? "Unknown IP"} · Created{" "}
						{formatDate(session.createdAt)}
					</p>
				</div>
			</div>

			{!isCurrentSession && (
				<Button
					className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
					disabled={loading}
					onClick={handleRevoke}
					size="sm"
					variant="ghost"
				>
					{loading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<X className="h-4 w-4" />
					)}
					Revoke
				</Button>
			)}
		</div>
	);
}
