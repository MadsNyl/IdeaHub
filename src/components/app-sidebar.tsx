"use client";

import { Home, Lightbulb, Settings, Shield, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";

const menuItems = [
	{ title: "Dashboard", icon: Home, url: "/" },
	{ title: "Ideas", icon: Lightbulb, url: "/ideas" },
	{ title: "Team", icon: Users, url: "/team" },
	{ title: "Settings", icon: Settings, url: "/settings" },
];

const adminItems = [{ title: "Users", icon: Shield, url: "/admin/users" }];

interface AppSidebarProps {
	isAdmin?: boolean;
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-2">
					<Lightbulb className="h-6 w-6 text-purple-500" />
					<span className="font-bold text-lg">IdeaHub</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{isAdmin && (
					<SidebarGroup>
						<SidebarGroupLabel>Admin</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{adminItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={pathname === item.url}>
											<Link href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>
			<SidebarFooter>
				<div className="px-2 py-2 text-muted-foreground text-xs">
					© 2026 IdeaHub
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
