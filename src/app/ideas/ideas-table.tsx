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
			<div className="flex items-center justify-between text-muted-foreground text-sm">
				<div>
					Showing {data.ideas.length} of {data.pagination.total} ideas
				</div>
				<div>
					Page {data.pagination.page} of {data.pagination.totalPages}
				</div>
			</div>
		</div>
	);
}
