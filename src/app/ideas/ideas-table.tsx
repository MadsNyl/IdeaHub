"use client";

import { DataTable } from "~/components/data-table";
import type { listIdeas } from "~/services/idea";

import { columns } from "./columns";

interface IdeasTableProps {
	data: Awaited<ReturnType<typeof listIdeas>>;
}

export function IdeasTable({ data }: IdeasTableProps) {
	return (
		<div className="space-y-4">
			<DataTable columns={columns} data={data.ideas} />
			<div className="flex items-center justify-between border-border/40 border-t pt-4 text-muted-foreground text-xs">
				<span>
					{data.pagination.total}{" "}
					{data.pagination.total === 1 ? "idea" : "ideas"} total
				</span>
				<span>
					Page {data.pagination.page} of {data.pagination.totalPages}
				</span>
			</div>
		</div>
	);
}
