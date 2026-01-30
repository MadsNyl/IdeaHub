import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";
import { getUserAccounts, getUserSessions } from "~/services/user";

import { ConnectedAccounts } from "./_components/connected-accounts";
import { ProfileForm } from "./_components/profile-form";
import { SessionsList } from "./_components/sessions-list";
import { SignOutSection } from "./_components/sign-out-section";

export default async function SettingsPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const [accounts, sessions] = await Promise.all([
		getUserAccounts(session.user.id),
		getUserSessions(session.user.id),
	]);

	const cookieStore = await cookies();
	const sessionToken =
		cookieStore.get("better-auth.session_token")?.value ?? "";

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="space-y-1">
					<h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
					<p className="text-muted-foreground text-sm">
						Manage your account and preferences
					</p>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-auto">
				<div className="mx-auto max-w-2xl space-y-8 px-8 py-8">
					<ProfileForm
						defaultName={session.user.name}
						email={session.user.email}
					/>
					<ConnectedAccounts accounts={accounts} />
					<SessionsList
						currentSessionToken={sessionToken}
						sessions={sessions}
					/>
					<SignOutSection />
				</div>
			</main>
		</div>
	);
}
