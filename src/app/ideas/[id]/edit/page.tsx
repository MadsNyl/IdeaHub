import { notFound, redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";
import { getIdea } from "~/services/idea";

import { EditIdeaForm } from "./_components/edit-idea-form";

interface EditIdeaPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditIdeaPage({ params }: EditIdeaPageProps) {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const { id } = await params;
	const idea = await getIdea({ id, userId: session.user.id });

	if (!idea) {
		notFound();
	}

	return (
		<div className="flex h-full flex-col">
			<header className="border-b bg-background px-6 py-4">
				<div>
					<h1 className="font-bold text-2xl">Edit Idea</h1>
					<p className="text-muted-foreground text-sm">
						Update your startup idea
					</p>
				</div>
			</header>
			<main className="flex-1 p-6">
				<div className="max-w-2xl">
					<EditIdeaForm idea={idea} />
				</div>
			</main>
		</div>
	);
}
