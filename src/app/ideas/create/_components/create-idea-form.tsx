"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Editor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type CreateIdeaInput, createIdeaSchema } from "~/schemas/idea";
import { api } from "~/trpc/react";

export function CreateIdeaForm() {
	const router = useRouter();

	const form = useForm<CreateIdeaInput>({
		resolver: zodResolver(createIdeaSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const createIdea = api.idea.create.useMutation({
		onSuccess: () => {
			toast.success("Idea created");
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
		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
			<div className="space-y-2">
				<label className="font-medium text-sm" htmlFor="title">
					Title
				</label>
				<Input
					id="title"
					placeholder="My startup idea"
					{...form.register("title")}
				/>
				{form.formState.errors.title && (
					<p className="text-destructive text-sm">
						{form.formState.errors.title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<label className="font-medium text-sm" htmlFor="description">
					Description
				</label>
				<Editor
					content={form.watch("description")}
					onChange={(content) => form.setValue("description", content)}
					placeholder="Describe your idea..."
				/>
				{form.formState.errors.description && (
					<p className="text-destructive text-sm">
						{form.formState.errors.description.message}
					</p>
				)}
			</div>

			<div className="flex gap-4">
				<Button disabled={createIdea.isPending} type="submit">
					{createIdea.isPending ? "Creating..." : "Create Idea"}
				</Button>
				<Button
					onClick={() => router.push("/ideas")}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
