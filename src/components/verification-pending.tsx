import { Clock, Sparkles } from "lucide-react";

interface VerificationPendingProps {
	userName?: string | null;
}

export function VerificationPending({ userName }: VerificationPendingProps) {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
			{/* Subtle gradient background */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

			<div className="relative z-10 mx-auto max-w-md text-center">
				{/* Logo */}
				<div className="mb-8 flex justify-center">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
							<Sparkles className="h-5 w-5 text-primary" />
						</div>
						<span className="font-semibold text-xl tracking-tight">
							IdeaHub
						</span>
					</div>
				</div>

				{/* Icon */}
				<div className="mb-6 flex justify-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
						<Clock className="h-8 w-8 text-muted-foreground/60" />
					</div>
				</div>

				{/* Content */}
				<h1 className="mb-3 font-semibold text-2xl tracking-tight">
					Verification Pending
				</h1>
				<p className="mb-8 text-muted-foreground text-sm leading-relaxed">
					{userName ? `Hi ${userName}, your` : "Your"} account is being
					reviewed. An administrator will verify your account shortly.
				</p>

				{/* Info Card */}
				<div className="rounded-2xl border border-border/50 bg-card/50 p-6 text-left">
					<h2 className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">
						What happens next?
					</h2>
					<ul className="space-y-3">
						<li className="flex items-start gap-3">
							<div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
							<span className="text-muted-foreground text-sm">
								An admin will review your account details
							</span>
						</li>
						<li className="flex items-start gap-3">
							<div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
							<span className="text-muted-foreground text-sm">
								Once verified, you'll have full access to IdeaHub
							</span>
						</li>
						<li className="flex items-start gap-3">
							<div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
							<span className="text-muted-foreground text-sm">
								This usually takes less than 24 hours
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
