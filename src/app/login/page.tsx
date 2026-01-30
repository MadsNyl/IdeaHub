import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
	const session = await getSession();

	if (session) {
		redirect("/");
	}

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
			{/* Subtle gradient background */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

			{/* Content */}
			<div className="relative z-10 w-full max-w-md">
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

				<LoginForm />
			</div>
		</main>
	);
}
