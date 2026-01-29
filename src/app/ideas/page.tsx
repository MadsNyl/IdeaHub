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
			<header className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl">Ideas</h1>
						<p className="text-muted-foreground text-sm">
							Manage your startup ideas
						</p>
					</div>
					<Button asChild>
						<Link href="/ideas/create">New Idea</Link>
					</Button>
				</div>
			</header>
			<main className="flex-1 space-y-6 p-6">
				<div className="flex items-center gap-4">
					<SearchInput className="max-w-sm" placeholder="Search ideas..." />
				</div>
				<IdeasTable data={data} />
			</main>
		</div>
	);
}
