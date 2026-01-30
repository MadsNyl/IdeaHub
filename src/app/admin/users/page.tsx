import { redirect } from "next/navigation";

import { SearchInput } from "~/components/search-input";
import { getSession } from "~/server/better-auth/server";
import { listUsers } from "~/services/user";

import { UsersTable } from "./users-table";

interface AdminUsersPageProps {
	searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function AdminUsersPage({
	searchParams,
}: AdminUsersPageProps) {
	const session = await getSession();

	if (!session?.user.isAdmin) {
		redirect("/");
	}

	const params = await searchParams;
	const search = params.search;
	const page = Number(params.page) || 1;

	const data = await listUsers({ search, page, limit: 10 });

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="space-y-1">
					<h1 className="font-semibold text-2xl tracking-tight">
						User Management
					</h1>
					<p className="text-muted-foreground text-sm">
						Manage accounts, verification status, and admin permissions
					</p>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 space-y-6 p-8">
				<div className="flex items-center gap-4">
					<SearchInput
						className="w-full max-w-xs"
						placeholder="Search users..."
					/>
				</div>
				<UsersTable data={data} />
			</main>
		</div>
	);
}
