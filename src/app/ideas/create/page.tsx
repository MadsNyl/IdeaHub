import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { getSession } from "~/server/better-auth/server";

import { CreateIdeaForm } from "./_components/create-idea-form";

export default async function CreateIdeaPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="border-border/40 border-b px-8 py-6">
				<div className="flex items-start gap-4">
					<Button asChild className="mt-1 h-8 w-8" size="icon" variant="ghost">
						<Link href="/ideas">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div className="space-y-1">
						<h1 className="font-semibold text-2xl tracking-tight">New Idea</h1>
						<p className="text-muted-foreground text-sm">
							Capture and develop your startup concept
						</p>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-auto">
				<div className="mx-auto max-w-2xl px-8 py-8">
					<CreateIdeaForm />
				</div>
			</main>
		</div>
	);
}
