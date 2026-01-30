"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

export type Idea = {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
};

function IdeaActions({ idea }: { idea: Idea }) {
	const router = useRouter();

	const deleteIdea = api.idea.delete.useMutation({
		onSuccess: () => {
			router.refresh();
			toast.success("Idea deleted");
		},
		onError: () => {
			toast.error("Failed to delete idea");
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
					variant="ghost"
				>
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem asChild className="gap-2">
					<Link href={`/ideas/${idea.id}`}>
						<Eye className="h-4 w-4" />
						View
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="gap-2">
					<Link href={`/ideas/${idea.id}/edit`}>
						<Pencil className="h-4 w-4" />
						Edit
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="gap-2 text-destructive focus:text-destructive"
					disabled={deleteIdea.isPending}
					onClick={() => deleteIdea.mutate({ id: idea.id })}
				>
					<Trash2 className="h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<Idea>[] = [
	{
		accessorKey: "title",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Title
			</span>
		),
		cell: ({ row }) => {
			const idea = row.original;
			return (
				<Link
					className="font-medium text-sm transition-colors hover:text-primary"
					href={`/ideas/${idea.id}`}
				>
					{idea.title}
				</Link>
			);
		},
	},
	{
		accessorKey: "description",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Description
			</span>
		),
		cell: ({ row }) => {
			const description = row.getValue("description") as string;
			const plainText = description.replace(/<[^>]*>/g, "");
			const truncated =
				plainText.length > 80 ? `${plainText.slice(0, 80)}...` : plainText;
			return <span className="text-muted-foreground text-sm">{truncated}</span>;
		},
	},
	{
		accessorKey: "createdAt",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Created
			</span>
		),
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			return (
				<span className="text-muted-foreground text-sm">
					{format(new Date(date), "MMM d, yyyy")}
				</span>
			);
		},
	},
	{
		accessorKey: "updatedAt",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Updated
			</span>
		),
		cell: ({ row }) => {
			const date = row.getValue("updatedAt") as Date;
			return (
				<span className="text-muted-foreground text-sm">
					{format(new Date(date), "MMM d, yyyy")}
				</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <IdeaActions idea={row.original} />,
	},
];
