"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { authClient } from "~/server/better-auth/client";

import { SessionCard } from "./session-card";

interface Session {
	id: string;
	token: string;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	expiresAt: Date;
}

interface SessionsListProps {
	sessions: Session[];
	currentSessionToken: string;
}

export function SessionsList({
	sessions,
	currentSessionToken,
}: SessionsListProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
	const hasOtherSessions = otherSessions.length > 0;

	const handleRevokeAll = async () => {
		setLoading(true);
		try {
			const result = await authClient.revokeOtherSessions();

			if (result.error) {
				toast.error(result.error.message ?? "Failed to revoke sessions");
				return;
			}

			toast.success("All other sessions revoked");
			router.refresh();
		} catch {
			toast.error("Failed to revoke sessions");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-border/50 bg-card/50 p-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-lg">Active Sessions</h2>
				{hasOtherSessions && (
					<Button
						className="gap-2"
						disabled={loading}
						onClick={handleRevokeAll}
						size="sm"
						variant="outline"
					>
						{loading && <Loader2 className="h-4 w-4 animate-spin" />}
						Revoke All Others
					</Button>
				)}
			</div>

			<div className="space-y-3">
				{sessions.map((session) => (
					<SessionCard
						isCurrentSession={session.token === currentSessionToken}
						key={session.id}
						session={session}
					/>
				))}

				{sessions.length === 0 && (
					<p className="py-4 text-center text-muted-foreground text-sm">
						No active sessions found.
					</p>
				)}
			</div>
		</div>
	);
}
