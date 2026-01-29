import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";

export default async function Home() {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="flex h-full flex-col">
			<header className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl">Dashboard</h1>
						<p className="text-muted-foreground text-sm">
							Welcome back, {session.user?.name}
						</p>
					</div>
				</div>
			</header>
			<main className="flex-1 p-6">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div className="rounded-lg border bg-card p-6">
						<h3 className="mb-2 font-semibold text-lg">Total Ideas</h3>
						<p className="font-bold text-3xl">0</p>
						<p className="mt-2 text-muted-foreground text-sm">
							Start sharing your ideas
						</p>
					</div>
					<div className="rounded-lg border bg-card p-6">
						<h3 className="mb-2 font-semibold text-lg">In Progress</h3>
						<p className="font-bold text-3xl">0</p>
						<p className="mt-2 text-muted-foreground text-sm">
							Ideas being developed
						</p>
					</div>
					<div className="rounded-lg border bg-card p-6">
						<h3 className="mb-2 font-semibold text-lg">Team Members</h3>
						<p className="font-bold text-3xl">1</p>
						<p className="mt-2 text-muted-foreground text-sm">
							Collaborate with others
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
