"use client";

import { DataTable } from "~/components/data-table";
import type { listUsers } from "~/services/user";

import { columns } from "./columns";

interface UsersTableProps {
	data: Awaited<ReturnType<typeof listUsers>>;
}

export function UsersTable({ data }: UsersTableProps) {
	return (
		<div className="space-y-4">
			<DataTable columns={columns} data={data.users} />
			<div className="flex items-center justify-between text-muted-foreground text-sm">
				<div>
					Showing {data.users.length} of {data.pagination.total} users
				</div>
				<div>
					Page {data.pagination.page} of {data.pagination.totalPages}
				</div>
			</div>
		</div>
	);
}
