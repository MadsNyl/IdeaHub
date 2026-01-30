import { format } from "date-fns";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getSession } from "~/server/better-auth/server";
import { getIdeaById } from "~/services/idea";
import { listNotesByIdeaId } from "~/services/note";
import { CollapsibleDescription } from "./_components/collapsible-description";
import { NotesSection } from "./_components/notes-section";

interface IdeaDetailsPageProps {
	params: Promise<{ id: string }>;
}

export default async function IdeaDetailsPage({
	params,
}: IdeaDetailsPageProps) {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const { id } = await params;
	const [idea, notes] = await Promise.all([
		getIdeaById(id),
		listNotesByIdeaId(id),
	]);

	if (!idea) {
		notFound();
	}

	const isOwner = idea.createdBy.id === session.user.id;

	return (
		<div className="flex h-full w-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						<Button
							asChild
							className="mt-1 h-8 w-8"
							size="icon"
							variant="ghost"
						>
							<Link href="/ideas">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div className="space-y-2">
							<h1 className="font-semibold text-2xl tracking-tight">
								{idea.title}
							</h1>
							<div className="flex items-center gap-2.5">
								<Avatar className="h-6 w-6 ring-2 ring-background">
									<AvatarImage src={idea.createdBy.image ?? undefined} />
									<AvatarFallback className="bg-muted font-medium text-[10px]">
										{idea.createdBy.name?.charAt(0)?.toUpperCase() ?? "?"}
									</AvatarFallback>
								</Avatar>
								<div className="flex items-center gap-1.5 text-muted-foreground text-sm">
									<span className="font-medium text-foreground/80">
										{idea.createdBy.name}
									</span>
									<span className="opacity-40">·</span>
									<time>{format(idea.createdAt, "MMM d, yyyy")}</time>
								</div>
							</div>
						</div>
					</div>
					{isOwner && (
						<Button asChild className="gap-2" size="sm" variant="outline">
							<Link href={`/ideas/${idea.id}/edit`}>
								<Pencil className="h-3.5 w-3.5" />
								Edit
							</Link>
						</Button>
					)}
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-auto">
				<div className="mx-auto max-w-4xl space-y-8 px-8 py-8">
					<CollapsibleDescription description={idea.description} />
					<div className="h-px bg-border/50" />
					<NotesSection ideaId={idea.id} isOwner={isOwner} notes={notes} />
				</div>
			</main>
		</div>
	);
}
