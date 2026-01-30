"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { type UpdateNoteInput, updateNoteSchema } from "~/schemas/note";
import { api } from "~/trpc/react";
import { NoteTypeBadge, noteTypeConfig } from "./note-type-badge";

interface NoteDetailDialogProps {
	noteId: string | null;
	isOwner: boolean;
	onClose: () => void;
}

export function NoteDetailDialog({
	noteId,
	isOwner,
	onClose,
}: NoteDetailDialogProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const router = useRouter();

	const { data: note, isLoading } = api.note.get.useQuery(
		{ id: noteId ?? "" },
		{ enabled: !!noteId },
	);

	const form = useForm<UpdateNoteInput>({
		resolver: zodResolver(updateNoteSchema),
		defaultValues: {
			id: "",
			title: "",
			description: "",
			type: "RESEARCH",
		},
	});

	useEffect(() => {
		if (note) {
			form.reset({
				id: note.id,
				title: note.title,
				description: note.description,
				type: note.type,
			});
		}
	}, [note, form]);

	const updateNote = api.note.update.useMutation({
		onSuccess: () => {
			toast.success("Note updated successfully");
			setIsEditing(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const deleteNote = api.note.delete.useMutation({
		onSuccess: () => {
			toast.success("Note deleted successfully");
			onClose();
			router.refresh();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const onSubmit = (data: UpdateNoteInput) => {
		updateNote.mutate(data);
	};

	const handleDelete = () => {
		if (noteId) {
			deleteNote.mutate({ id: noteId });
		}
	};

	const handleClose = () => {
		setIsEditing(false);
		setShowDeleteConfirm(false);
		onClose();
	};

	if (showDeleteConfirm) {
		return (
			<Dialog onOpenChange={handleClose} open={!!noteId}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Delete Note</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this note? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 pt-4 sm:gap-0">
						<Button onClick={() => setShowDeleteConfirm(false)} variant="ghost">
							Cancel
						</Button>
						<Button
							className="gap-2"
							disabled={deleteNote.isPending}
							onClick={handleDelete}
							variant="destructive"
						>
							{deleteNote.isPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							{deleteNote.isPending ? "Deleting..." : "Delete Note"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	if (isEditing && note) {
		return (
			<Dialog onOpenChange={handleClose} open={!!noteId}>
				<DialogContent className="flex h-[90vh] w-[90vw] flex-col sm:max-w-[90vw]">
					<form
						className="flex min-h-0 flex-1 flex-col"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<DialogHeader>
							<DialogTitle>Edit Note</DialogTitle>
						</DialogHeader>
						<div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-6">
							<div className="flex gap-4">
								<div className="flex-1 space-y-2">
									<label
										className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
										htmlFor="edit-title"
									>
										Title
									</label>
									<Input
										className="h-10 border-border/50 bg-card/50 transition-colors focus:border-border focus:bg-card"
										id="edit-title"
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
										htmlFor="edit-type"
									>
										Type
									</label>
									<Select
										onValueChange={(value) =>
											form.setValue("type", value as UpdateNoteInput["type"])
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
									htmlFor="edit-description"
								>
									Description
								</label>
								<div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-card/50 transition-colors focus-within:border-border focus-within:bg-card">
									<Editor
										content={form.watch("description")}
										onChange={(content) =>
											form.setValue("description", content)
										}
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
								onClick={() => setIsEditing(false)}
								type="button"
								variant="ghost"
							>
								Cancel
							</Button>
							<Button
								className="gap-2"
								disabled={updateNote.isPending}
								type="submit"
							>
								{updateNote.isPending && (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								{updateNote.isPending ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog onOpenChange={handleClose} open={!!noteId}>
			<DialogContent className="flex h-[90vh] w-[90vw] flex-col sm:max-w-md">
				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : note ? (
					<>
						<DialogHeader className="space-y-3">
							<DialogTitle className="pr-8 text-xl">{note.title}</DialogTitle>
							<div className="flex items-center gap-2.5">
								<NoteTypeBadge type={note.type} />
								<span className="text-muted-foreground/60 text-xs">
									{format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}
								</span>
							</div>
						</DialogHeader>
						<div className="min-h-0 flex-1 overflow-y-auto py-4">
							<div
								className="prose prose-invert max-w-none text-muted-foreground text-sm leading-relaxed"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: TipTap editor sanitizes HTML output
								dangerouslySetInnerHTML={{ __html: note.description }}
							/>
						</div>
						{isOwner && (
							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									className="gap-1.5"
									onClick={() => setShowDeleteConfirm(true)}
									size="sm"
									variant="ghost"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Delete
								</Button>
								<Button
									className="gap-1.5"
									onClick={() => setIsEditing(true)}
									size="sm"
								>
									<Pencil className="h-3.5 w-3.5" />
									Edit
								</Button>
							</DialogFooter>
						)}
					</>
				) : (
					<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
						Note not found
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
