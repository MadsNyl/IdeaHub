"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Editor } from "~/components/editor";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { type CreateNoteInput, createNoteSchema } from "~/schemas/note";
import { api } from "~/trpc/react";
import { noteTypeConfig } from "./note-type-badge";

interface CreateNoteDialogProps {
	ideaId: string;
}

export function CreateNoteDialog({ ideaId }: CreateNoteDialogProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<CreateNoteInput>({
		resolver: zodResolver(createNoteSchema),
		defaultValues: {
			ideaId,
			title: "",
			description: "",
			type: "RESEARCH",
		},
	});

	const createNote = api.note.create.useMutation({
		onSuccess: () => {
			toast.success("Note created successfully");
			setOpen(false);
			form.reset({ ideaId, title: "", description: "", type: "RESEARCH" });
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const onSubmit = (data: CreateNoteInput) => {
		createNote.mutate(data);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="h-8 gap-1.5 text-xs" size="sm">
					<Plus className="h-3.5 w-3.5" />
					Add Note
				</Button>
			</DialogTrigger>
			<DialogContent className="flex h-[90vh] w-[90vw] flex-col sm:max-w-[90vw]">
				<form
					className="flex min-h-0 flex-1 flex-col"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<DialogHeader>
						<DialogTitle>Add Note</DialogTitle>
						<DialogDescription>
							Track research, meetings, feedback, and more.
						</DialogDescription>
					</DialogHeader>
					<div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-6">
						<div className="flex gap-4">
							<div className="flex-1 space-y-2">
								<label
									className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
									htmlFor="title"
								>
									Title
								</label>
								<Input
									className="h-10 border-border/50 bg-card/50 transition-colors focus:border-border focus:bg-card"
									id="title"
									placeholder="Note title"
									{...form.register("title")}
								/>
								{form.formState.errors.title && (
									<p className="text-destructive text-xs">
										{form.formState.errors.title.message}
									</p>
								)}
							</div>
							<div className="w-48 space-y-2">
								<label
									className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
									htmlFor="type"
								>
									Type
								</label>
								<Select
									onValueChange={(value) =>
										form.setValue("type", value as CreateNoteInput["type"])
									}
									value={form.watch("type")}
								>
									<SelectTrigger className="h-10 w-full border-border/50 bg-card/50 transition-colors focus:border-border focus:bg-card">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(noteTypeConfig).map(([value, config]) => (
											<SelectItem key={value} value={value}>
												{config.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex min-h-0 flex-1 flex-col space-y-2">
							<label
								className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
								htmlFor="description"
							>
								Description
							</label>
							<div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-border focus-within:bg-card">
								<Editor
									content={form.watch("description")}
									onChange={(content) => form.setValue("description", content)}
									placeholder="Write your note here..."
								/>
							</div>
							{form.formState.errors.description && (
								<p className="text-destructive text-xs">
									{form.formState.errors.description.message}
								</p>
							)}
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							onClick={() => setOpen(false)}
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button
							className="gap-2"
							disabled={createNote.isPending}
							type="submit"
						>
							{createNote.isPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							{createNote.isPending ? "Creating..." : "Create Note"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
