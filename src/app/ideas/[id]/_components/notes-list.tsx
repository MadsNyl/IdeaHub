"use client";

import { format } from "date-fns";
import type { Prisma } from "generated/prisma";
import { MessageSquare } from "lucide-react";
import type { ListNoteEntry } from "~/types/note";
import { NoteTypeBadge } from "./note-type-badge";

type Note = Prisma.NoteGetPayload<{ select: typeof ListNoteEntry }>;

interface NotesListProps {
	notes: Note[];
	onNoteClick: (noteId: string) => void;
}

export function NotesList({ notes, onNoteClick }: NotesListProps) {
	if (notes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-border/50 border-dashed py-12">
				<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
					<MessageSquare className="h-5 w-5 text-muted-foreground/60" />
				</div>
				<p className="text-muted-foreground text-sm">No notes yet</p>
				<p className="mt-1 text-muted-foreground/60 text-xs">
					Add notes to track progress and insights
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{notes.map((note) => (
				<button
					className="group flex w-full items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-all hover:border-border hover:bg-card"
					key={note.id}
					onClick={() => onNoteClick(note.id)}
					type="button"
				>
					<div className="flex items-center gap-3">
						<NoteTypeBadge type={note.type} />
						<span className="font-medium text-sm transition-colors group-hover:text-primary">
							{note.title}
						</span>
					</div>
					<time className="text-muted-foreground/60 text-xs">
						{format(note.createdAt, "MMM d, yyyy")}
					</time>
				</button>
			))}
		</div>
	);
}
