import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { VerificationPending } from "~/components/verification-pending";
import { getSession } from "~/server/better-auth/server";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "IdeaHub - CRM for Startup Ideas",
	description: "Collaborate and iterate on startup ideas with AI-driven tools",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getSession();

	return (
		<html className={`${geist.variable} dark`} lang="en">
			<body>
				<TRPCReactProvider>
					{session ? (
						session.user.isVerified ? (
							<SidebarProvider>
								<AppSidebar isAdmin={session.user.isAdmin} />
								<SidebarInset>{children}</SidebarInset>
							</SidebarProvider>
						) : (
							<VerificationPending userName={session.user.name} />
						)
					) : (
						children
					)}
					<Toaster />
				</TRPCReactProvider>
			</body>
		</html>
	);
}
