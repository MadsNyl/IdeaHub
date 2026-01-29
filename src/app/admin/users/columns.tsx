"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
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

export type User = {
	id: string;
	name: string;
	email: string;
	image: string | null;
	isAdmin: boolean;
	isVerified: boolean;
	createdAt: Date;
};

function UserActions({ user }: { user: User }) {
	const router = useRouter();

	const updateVerification = api.user.updateVerification.useMutation({
		onSuccess: () => {
			router.refresh();
			toast.success("User verification status updated");
		},
		onError: () => {
			toast.error("Failed to update user verification status");
		},
	});

	const updateAdmin = api.user.updateAdmin.useMutation({
		onSuccess: () => {
			router.refresh();
			toast.success("User admin status updated");
		},
		onError: () => {
			toast.error("Failed to update user admin status");
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
				<DropdownMenuItem
					disabled={updateVerification.isPending}
					onClick={() =>
						updateVerification.mutate({
							userId: user.id,
							isVerified: !user.isVerified,
						})
					}
				>
					{user.isVerified ? "Revoke verification" : "Verify user"}
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={updateAdmin.isPending}
					onClick={() =>
						updateAdmin.mutate({
							userId: user.id,
							isAdmin: !user.isAdmin,
						})
					}
				>
					{user.isAdmin ? "Remove admin" : "Make admin"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "isVerified",
		header: "Status",
		cell: ({ row }) => {
			const isVerified = row.getValue("isVerified") as boolean;
			return (
				<Badge variant={isVerified ? "default" : "secondary"}>
					{isVerified ? "Verified" : "Pending"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "isAdmin",
		header: "Role",
		cell: ({ row }) => {
			const isAdmin = row.getValue("isAdmin") as boolean;
			return (
				<Badge variant={isAdmin ? "destructive" : "outline"}>
					{isAdmin ? "Admin" : "User"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			return new Date(date).toLocaleDateString();
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <UserActions user={row.original} />,
	},
];
