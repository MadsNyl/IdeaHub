"use client";

import type { Prisma } from "generated/prisma";
import { StickyNote } from "lucide-react";
import { useState } from "react";
import type { ListNoteEntry } from "~/types/note";
import { CreateNoteDialog } from "./create-note-dialog";
import { NoteDetailDialog } from "./note-detail-dialog";
import { NotesList } from "./notes-list";

type Note = Prisma.NoteGetPayload<{ select: typeof ListNoteEntry }>;

interface NotesSectionProps {
	ideaId: string;
	notes: Note[];
	isOwner: boolean;
}

export function NotesSection({ ideaId, notes, isOwner }: NotesSectionProps) {
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<StickyNote className="h-4 w-4 text-muted-foreground" />
					<h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
						Notes
						{notes.length > 0 && (
							<span className="ml-2 text-muted-foreground/60">
								({notes.length})
							</span>
						)}
					</h2>
				</div>
				{isOwner && <CreateNoteDialog ideaId={ideaId} />}
			</div>
			<NotesList notes={notes} onNoteClick={setSelectedNoteId} />
			<NoteDetailDialog
				isOwner={isOwner}
				noteId={selectedNoteId}
				onClose={() => setSelectedNoteId(null)}
			/>
		</div>
	);
}
