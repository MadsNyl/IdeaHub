import { format } from "date-fns";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getSession } from "~/server/better-auth/server";
import { getIdeaById } from "~/services/idea";

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
	const idea = await getIdeaById(id);

	if (!idea) {
		notFound();
	}

	const isOwner = idea.createdBy.id === session.user.id;

	return (
		<div className="flex h-full flex-col">
			<header className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button asChild size="icon" variant="ghost">
							<Link href="/ideas">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<div>
							<h1 className="font-bold text-2xl">{idea.title}</h1>
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<Avatar className="h-5 w-5">
									<AvatarImage src={idea.createdBy.image ?? undefined} />
									<AvatarFallback className="text-xs">
										{idea.createdBy.name?.charAt(0)?.toUpperCase() ?? "?"}
									</AvatarFallback>
								</Avatar>
								<span>{idea.createdBy.name}</span>
								<span>·</span>
								<span>{format(idea.createdAt, "MMM d, yyyy")}</span>
							</div>
						</div>
					</div>
					{isOwner && (
						<Button asChild variant="outline">
							<Link href={`/ideas/${idea.id}/edit`}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</Link>
						</Button>
					)}
				</div>
			</header>
			<main className="flex-1 p-6">
				<div className="prose prose-invert max-w-none">
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text content from Tiptap editor */}
					<div dangerouslySetInnerHTML={{ __html: idea.description }} />
				</div>
			</main>
		</div>
	);
}
