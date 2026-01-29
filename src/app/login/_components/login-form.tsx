"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/server/better-auth/client";

type AuthMode = "signin" | "signup";

export function LoginForm() {
	const router = useRouter();
	const [mode, setMode] = useState<AuthMode>("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (mode === "signup") {
				const result = await authClient.signUp.email({
					email,
					password,
					name,
				});
				if (result.error) {
					setError(result.error.message ?? "Failed to create account");
					return;
				}
			} else {
				const result = await authClient.signIn.email({
					email,
					password,
				});
				if (result.error) {
					setError(result.error.message ?? "Invalid credentials");
					return;
				}
			}
			router.push("/");
			router.refresh();
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleGitHubSignIn = async () => {
		setError(null);
		setLoading(true);
		try {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: "/",
			});
		} catch {
			setError("Failed to sign in with GitHub");
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md space-y-8">
			<div className="text-center">
				<h1 className="font-bold text-3xl text-foreground tracking-tight">
					{mode === "signin" ? "Welcome back" : "Create your account"}
				</h1>
				<p className="mt-2 text-muted-foreground">
					{mode === "signin"
						? "Sign in to continue to IdeaHub"
						: "Get started with IdeaHub today"}
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<button
					className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
					disabled={loading}
					onClick={handleGitHubSignIn}
					type="button"
				>
					<svg
						aria-hidden="true"
						className="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							clipRule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							fillRule="evenodd"
						/>
					</svg>
					Continue with GitHub
				</button>

				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-border border-t" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-card px-4 text-muted-foreground">
							or continue with email
						</span>
					</div>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					{mode === "signup" && (
						<div>
							<label
								className="block font-medium text-foreground text-sm"
								htmlFor="name"
							>
								Name
							</label>
							<input
								className="mt-1 block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
								id="name"
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								required
								type="text"
								value={name}
							/>
						</div>
					)}

					<div>
						<label
							className="block font-medium text-foreground text-sm"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="mt-1 block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
							id="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							type="email"
							value={email}
						/>
					</div>

					<div>
						<label
							className="block font-medium text-foreground text-sm"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="mt-1 block w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
							id="password"
							minLength={8}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							type="password"
							value={password}
						/>
					</div>

					{error && (
						<div className="rounded-lg bg-destructive/10 px-4 py-3 text-destructive text-sm">
							{error}
						</div>
					)}

					<button
						className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={loading}
						type="submit"
					>
						{loading
							? "Loading..."
							: mode === "signin"
								? "Sign in"
								: "Create account"}
					</button>
				</form>
			</div>

			<p className="text-center text-muted-foreground text-sm">
				{mode === "signin" ? (
					<>
						Don&apos;t have an account?{" "}
						<button
							className="font-medium text-primary hover:underline"
							onClick={() => {
								setMode("signup");
								setError(null);
							}}
							type="button"
						>
							Sign up
						</button>
					</>
				) : (
					<>
						Already have an account?{" "}
						<button
							className="font-medium text-primary hover:underline"
							onClick={() => {
								setMode("signin");
								setError(null);
							}}
							type="button"
						>
							Sign in
						</button>
					</>
				)}
			</p>
		</div>
	);
}
