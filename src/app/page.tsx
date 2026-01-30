import { format } from "date-fns";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchInput } from "~/components/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getSession } from "~/server/better-auth/server";
import { getAllIdeas } from "~/services/idea";

function truncateHtml(html: string, maxLength: number = 300): string {
	if (html.length <= maxLength) {
		return html;
	}

	let truncated = html.substring(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");
	const lastTag = truncated.lastIndexOf(">");

	const breakPoint = Math.max(lastSpace, lastTag);
	if (breakPoint > 0) {
		truncated = html.substring(0, breakPoint + 1);
	}

	return truncated;
}

interface HomeProps {
	searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	const { search } = await searchParams;
	const ideas = await getAllIdeas(search);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<h1 className="font-semibold text-2xl tracking-tight">
							Community Ideas
						</h1>
						<p className="text-muted-foreground text-sm">
							Discover and explore startup ideas from the community
						</p>
					</div>
					<SearchInput
						className="w-full sm:w-80"
						placeholder="Search ideas..."
					/>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-auto">
				{ideas.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center px-8 py-16">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
							<Sparkles className="h-8 w-8 text-muted-foreground/60" />
						</div>
						<h3 className="mb-2 font-medium text-lg">No ideas yet</h3>
						<p className="mb-6 max-w-sm text-center text-muted-foreground text-sm">
							Be the first to share an idea with the community
						</p>
						<Link
							className="inline-flex items-center gap-2 font-medium text-primary text-sm transition-colors hover:text-primary/80"
							href="/ideas/create"
						>
							Create your first idea
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				) : (
					<div className="p-8">
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{ideas.map((idea, index) => (
								<Link
									className="group relative block"
									href={`/ideas/${idea.id}`}
									key={idea.id}
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<article className="relative h-full overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-border hover:bg-card">
										{/* Author & Date */}
										<div className="mb-4 flex items-center gap-2.5">
											<Avatar className="h-7 w-7 ring-2 ring-background">
												<AvatarImage src={idea.createdBy.image ?? undefined} />
												<AvatarFallback className="bg-muted font-medium text-[11px]">
													{idea.createdBy.name?.charAt(0)?.toUpperCase() ?? "?"}
												</AvatarFallback>
											</Avatar>
											<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
												<span className="font-medium text-foreground/80">
													{idea.createdBy.name}
												</span>
												<span className="opacity-40">·</span>
												<time>{format(idea.createdAt, "MMM d")}</time>
											</div>
										</div>

										{/* Title */}
										<h3 className="mb-3 font-medium text-base leading-snug tracking-tight transition-colors group-hover:text-primary">
											{idea.title}
										</h3>

										{/* Description Preview */}
										<div className="relative">
											<div
												className="[&_*]:!m-0 [&_*]:!p-0 line-clamp-3 text-muted-foreground text-sm leading-relaxed [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-sm [&_h4]:text-sm"
												// biome-ignore lint/security/noDangerouslySetInnerHtml: Sanitized rich text
												dangerouslySetInnerHTML={{
													__html: truncateHtml(idea.description),
												}}
											/>
										</div>

										{/* Hover Arrow */}
										<div className="mt-4 flex items-center gap-1 text-primary text-sm opacity-0 transition-opacity group-hover:opacity-100">
											<span className="font-medium">Read more</span>
											<ArrowRight className="h-3.5 w-3.5" />
										</div>
									</article>
								</Link>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
