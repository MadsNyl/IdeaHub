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
			<div className="flex items-center justify-between border-border/40 border-t pt-4 text-muted-foreground text-xs">
				<span>
					{data.pagination.total}{" "}
					{data.pagination.total === 1 ? "user" : "users"} total
				</span>
				<span>
					Page {data.pagination.page} of {data.pagination.totalPages}
				</span>
			</div>
		</div>
	);
}
