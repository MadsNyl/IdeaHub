import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SearchInput } from "~/components/search-input";
import { Button } from "~/components/ui/button";
import { getSession } from "~/server/better-auth/server";
import { listIdeas } from "~/services/idea";

import { IdeasTable } from "./ideas-table";

interface IdeasPageProps {
	searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	const params = await searchParams;
	const search = params.search;
	const page = Number(params.page) || 1;

	const data = await listIdeas({
		userId: session.user.id,
		search,
		page,
		limit: 10,
	});

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<h1 className="font-semibold text-2xl tracking-tight">My Ideas</h1>
						<p className="text-muted-foreground text-sm">
							Manage and track your startup ideas
						</p>
					</div>
					<Button asChild className="gap-2" size="sm">
						<Link href="/ideas/create">
							<Plus className="h-4 w-4" />
							New Idea
						</Link>
					</Button>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 space-y-6 p-8">
				<div className="flex items-center gap-4">
					<SearchInput
						className="w-full max-w-xs"
						placeholder="Search your ideas..."
					/>
				</div>
				<IdeasTable data={data} />
			</main>
		</div>
	);
}
