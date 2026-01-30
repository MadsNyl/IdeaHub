"use client";

import {
	Home,
	Lightbulb,
	Settings,
	Shield,
	Sparkles,
	Users,
} from "lucide-react";
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
		<Sidebar className="border-r-0">
			<SidebarHeader className="px-4 py-6">
				<Link className="group flex items-center gap-3" href="/">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
						<Sparkles className="h-5 w-5 text-primary" />
					</div>
					<span className="font-semibold text-lg tracking-tight">IdeaHub</span>
				</Link>
			</SidebarHeader>
			<SidebarContent className="px-2">
				<SidebarGroup>
					<SidebarGroupLabel className="mb-2 px-3 font-medium text-[11px] text-muted-foreground/70 uppercase tracking-wider">
						Navigation
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="space-y-1">
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className="h-10 rounded-lg px-3 transition-all duration-200 hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
										isActive={pathname === item.url}
									>
										<Link href={item.url}>
											<item.icon className="h-4 w-4" />
											<span className="font-medium">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{isAdmin && (
					<SidebarGroup className="mt-6">
						<SidebarGroupLabel className="mb-2 px-3 font-medium text-[11px] text-muted-foreground/70 uppercase tracking-wider">
							Admin
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="space-y-1">
								{adminItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="h-10 rounded-lg px-3 transition-all duration-200 hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
											isActive={pathname === item.url}
										>
											<Link href={item.url}>
												<item.icon className="h-4 w-4" />
												<span className="font-medium">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>
			<SidebarFooter className="px-4 py-4">
				<div className="text-muted-foreground/50 text-xs">IdeaHub</div>
			</SidebarFooter>
		</Sidebar>
	);
}
