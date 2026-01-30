"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { authClient } from "~/server/better-auth/client";

export function SignOutSection() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);
		try {
			const result = await authClient.signOut();

			if (result.error) {
				toast.error(result.error.message ?? "Failed to sign out");
				setLoading(false);
				return;
			}

			router.push("/login");
			router.refresh();
		} catch {
			toast.error("Failed to sign out");
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-border/50 bg-card/50 p-6">
			<h2 className="mb-2 font-semibold text-lg">Sign Out</h2>
			<p className="mb-4 text-muted-foreground text-sm">
				Sign out of your account on this device.
			</p>

			<Button
				className="gap-2"
				disabled={loading}
				onClick={handleSignOut}
				variant="destructive"
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<LogOut className="h-4 w-4" />
				)}
				{loading ? "Signing out..." : "Sign Out"}
			</Button>
		</div>
	);
}
