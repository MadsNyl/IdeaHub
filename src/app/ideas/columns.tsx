"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
				<Button className="h-8 w-8 p-0" variant="ghost">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/ideas/${idea.id}`}>View</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={`/ideas/${idea.id}/edit`}>Edit</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-destructive"
					disabled={deleteIdea.isPending}
					onClick={() => deleteIdea.mutate({ id: idea.id })}
				>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<Idea>[] = [
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => {
			const idea = row.original;
			return (
				<Link
					className="font-medium hover:underline"
					href={`/ideas/${idea.id}`}
				>
					{idea.title}
				</Link>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => {
			const description = row.getValue("description") as string;
			const plainText = description.replace(/<[^>]*>/g, "");
			const truncated =
				plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;
			return <span className="text-muted-foreground">{truncated}</span>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			return new Date(date).toLocaleDateString();
		},
	},
	{
		accessorKey: "updatedAt",
		header: "Updated",
		cell: ({ row }) => {
			const date = row.getValue("updatedAt") as Date;
			return new Date(date).toLocaleDateString();
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <IdeaActions idea={row.original} />,
	},
];
