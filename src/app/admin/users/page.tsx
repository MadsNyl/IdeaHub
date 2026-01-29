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
			<header className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl">User Management</h1>
						<p className="text-muted-foreground text-sm">
							Manage user accounts, verification, and admin access
						</p>
					</div>
				</div>
			</header>
			<main className="flex-1 space-y-6 p-6">
				<div className="flex items-center gap-4">
					<SearchInput
						className="max-w-sm"
						placeholder="Search users by name or email..."
					/>
				</div>
				<UsersTable data={data} />
			</main>
		</div>
	);
}
