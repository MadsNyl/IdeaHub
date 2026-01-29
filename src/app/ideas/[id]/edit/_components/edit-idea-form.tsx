"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Editor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { type UpdateIdeaInput, updateIdeaSchema } from "~/schemas/idea";
import { api } from "~/trpc/react";

interface EditIdeaFormProps {
	idea: {
		id: string;
		title: string;
		description: string;
	};
}

export function EditIdeaForm({ idea }: EditIdeaFormProps) {
	const router = useRouter();

	const form = useForm<UpdateIdeaInput>({
		resolver: zodResolver(updateIdeaSchema),
		defaultValues: {
			id: idea.id,
			title: idea.title,
			description: idea.description,
		},
	});

	const updateIdea = api.idea.update.useMutation({
		onSuccess: () => {
			toast.success("Idea updated");
			router.push("/ideas");
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update idea");
		},
	});

	const onSubmit = (data: UpdateIdeaInput) => {
		updateIdea.mutate(data);
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
				<Button disabled={updateIdea.isPending} type="submit">
					{updateIdea.isPending ? "Saving..." : "Save Changes"}
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
