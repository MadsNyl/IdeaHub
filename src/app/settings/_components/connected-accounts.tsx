"use client";

import { Check, Github, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { authClient } from "~/server/better-auth/client";

interface Account {
	id: string;
	providerId: string;
	accountId: string;
	createdAt: Date;
}

interface ConnectedAccountsProps {
	accounts: Account[];
}

export function ConnectedAccounts({ accounts }: ConnectedAccountsProps) {
	const [loading, setLoading] = useState(false);

	const hasCredential = accounts.some((a) => a.providerId === "credential");
	const hasGithub = accounts.some((a) => a.providerId === "github");

	const handleConnectGitHub = async () => {
		setLoading(true);
		try {
			await authClient.linkSocial({
				provider: "github",
				callbackURL: "/settings",
			});
		} catch {
			toast.error("Failed to connect GitHub");
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-border/50 bg-card/50 p-6">
			<h2 className="mb-4 font-semibold text-lg">Connected Accounts</h2>

			<div className="space-y-3">
				{/* Email Provider */}
				<div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Mail className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-medium">Email & Password</p>
							<p className="text-muted-foreground text-sm">
								{hasCredential ? "Connected" : "Sign up with email to enable"}
							</p>
						</div>
					</div>
					{hasCredential && (
						<div className="flex items-center gap-1.5 text-emerald-500 text-sm">
							<Check className="h-4 w-4" />
							Connected
						</div>
					)}
				</div>

				{/* GitHub Provider */}
				<div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Github className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-medium">GitHub</p>
							<p className="text-muted-foreground text-sm">
								{hasGithub ? "Connected" : "Connect for quick sign in"}
							</p>
						</div>
					</div>
					{hasGithub ? (
						<div className="flex items-center gap-1.5 text-emerald-500 text-sm">
							<Check className="h-4 w-4" />
							Connected
						</div>
					) : (
						<Button
							className="gap-2"
							disabled={loading}
							onClick={handleConnectGitHub}
							size="sm"
							variant="outline"
						>
							{loading && <Loader2 className="h-4 w-4 animate-spin" />}
							Connect
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
