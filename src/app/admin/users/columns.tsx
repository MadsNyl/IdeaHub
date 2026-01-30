"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	CheckCircle2,
	MoreHorizontal,
	Shield,
	ShieldOff,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
			toast.success("Verification status updated");
		},
		onError: () => {
			toast.error("Failed to update verification status");
		},
	});

	const updateAdmin = api.user.updateAdmin.useMutation({
		onSuccess: () => {
			router.refresh();
			toast.success("Admin status updated");
		},
		onError: () => {
			toast.error("Failed to update admin status");
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
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					className="gap-2"
					disabled={updateVerification.isPending}
					onClick={() =>
						updateVerification.mutate({
							userId: user.id,
							isVerified: !user.isVerified,
						})
					}
				>
					{user.isVerified ? (
						<>
							<XCircle className="h-4 w-4" />
							Revoke verification
						</>
					) : (
						<>
							<CheckCircle2 className="h-4 w-4" />
							Verify user
						</>
					)}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="gap-2"
					disabled={updateAdmin.isPending}
					onClick={() =>
						updateAdmin.mutate({
							userId: user.id,
							isAdmin: !user.isAdmin,
						})
					}
				>
					{user.isAdmin ? (
						<>
							<ShieldOff className="h-4 w-4" />
							Remove admin
						</>
					) : (
						<>
							<Shield className="h-4 w-4" />
							Make admin
						</>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				User
			</span>
		),
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image ?? undefined} />
						<AvatarFallback className="bg-muted font-medium text-xs">
							{user.name?.charAt(0)?.toUpperCase() ?? "?"}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium text-sm">{user.name}</span>
						<span className="text-muted-foreground text-xs">{user.email}</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "isVerified",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Status
			</span>
		),
		cell: ({ row }) => {
			const isVerified = row.getValue("isVerified") as boolean;
			return (
				<Badge
					className="font-medium"
					variant={isVerified ? "default" : "secondary"}
				>
					{isVerified ? "Verified" : "Pending"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "isAdmin",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Role
			</span>
		),
		cell: ({ row }) => {
			const isAdmin = row.getValue("isAdmin") as boolean;
			return (
				<span
					className={`text-sm ${isAdmin ? "font-medium text-primary" : "text-muted-foreground"}`}
				>
					{isAdmin ? "Admin" : "User"}
				</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: () => (
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Joined
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
		id: "actions",
		cell: ({ row }) => <UserActions user={row.original} />,
	},
];
