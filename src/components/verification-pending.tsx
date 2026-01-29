import { Clock } from "lucide-react";

interface VerificationPendingProps {
	userName?: string | null;
}

export function VerificationPending({ userName }: VerificationPendingProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="mx-auto max-w-md text-center">
				<div className="mb-6 flex justify-center">
					<div className="rounded-full bg-muted p-4">
						<Clock className="h-12 w-12 text-muted-foreground" />
					</div>
				</div>
				<h1 className="mb-2 font-bold text-2xl">
					Account Pending Verification
				</h1>
				<p className="mb-6 text-muted-foreground">
					{userName ? `Hi ${userName}, your` : "Your"} account is currently
					pending verification. An administrator will review your account
					shortly.
				</p>
				<div className="rounded-lg border bg-card p-4">
					<h2 className="mb-2 font-semibold">What happens next?</h2>
					<ul className="space-y-2 text-left text-muted-foreground text-sm">
						<li className="flex items-start gap-2">
							<span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
							<span>An admin will review your account details</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
							<span>Once verified, you'll have full access to IdeaHub</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
							<span>This usually takes less than 24 hours</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
