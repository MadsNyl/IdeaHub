"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Editor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type CreateIdeaInput, createIdeaSchema } from "~/schemas/idea";
import { api } from "~/trpc/react";
import { IdeaExplanationDialog } from "./idea-explanation-dialog";

export function CreateIdeaForm() {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useForm<CreateIdeaInput>({
		resolver: zodResolver(createIdeaSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const createIdea = api.idea.create.useMutation({
		onSuccess: () => {
			toast.success("Idea created successfully");
			router.push("/ideas");
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create idea");
		},
	});

	const onSubmit = (data: CreateIdeaInput) => {
		createIdea.mutate(data);
	};

	return (
		<>
			<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
				{/* Title Field */}
				<div className="space-y-2">
					<label
						className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						htmlFor="title"
					>
						Title
					</label>
					<Input
						className="h-12 border-border/50 bg-card/50 text-base transition-colors focus:border-border focus:bg-card"
						id="title"
						placeholder="What's your idea called?"
						{...form.register("title")}
					/>
					{form.formState.errors.title && (
						<p className="text-destructive text-xs">
							{form.formState.errors.title.message}
						</p>
					)}
				</div>

				{/* Description Field */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<label
							className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
							htmlFor="description"
						>
							Description
						</label>
						<Button
							className="h-8 gap-1.5 text-xs"
							onClick={() => setDialogOpen(true)}
							size="sm"
							type="button"
							variant="outline"
						>
							<Sparkles className="h-3.5 w-3.5" />
							AI Enhance
						</Button>
					</div>
					<div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-border focus-within:bg-card">
						<Editor
							content={form.watch("description")}
							onChange={(content) => form.setValue("description", content)}
							placeholder="Describe your idea in detail..."
						/>
					</div>
					{form.formState.errors.description && (
						<p className="text-destructive text-xs">
							{form.formState.errors.description.message}
						</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3 border-border/40 border-t pt-6">
					<Button
						className="gap-2"
						disabled={createIdea.isPending}
						type="submit"
					>
						{createIdea.isPending && (
							<Loader2 className="h-4 w-4 animate-spin" />
						)}
						{createIdea.isPending ? "Creating..." : "Create Idea"}
					</Button>
					<Button
						onClick={() => router.push("/ideas")}
						type="button"
						variant="ghost"
					>
						Cancel
					</Button>
				</div>
			</form>

			<IdeaExplanationDialog
				onDescriptionGenerated={(description) =>
					form.setValue("description", description)
				}
				onOpenChange={setDialogOpen}
				open={dialogOpen}
				title={form.watch("title")}
			/>
		</>
	);
}
