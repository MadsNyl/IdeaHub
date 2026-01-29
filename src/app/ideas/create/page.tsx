import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";

import { CreateIdeaForm } from "./_components/create-idea-form";

export default async function CreateIdeaPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="flex h-full flex-col">
			<header className="border-b bg-background px-6 py-4">
				<div>
					<h1 className="font-bold text-2xl">New Idea</h1>
					<p className="text-muted-foreground text-sm">
						Create a new startup idea
					</p>
				</div>
			</header>
			<main className="flex-1 p-6">
				<div className="max-w-2xl">
					<CreateIdeaForm />
				</div>
			</main>
		</div>
	);
}
