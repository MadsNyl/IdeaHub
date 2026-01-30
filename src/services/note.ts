import { db } from "~/server/db";
import { ListNoteEntry, NoteDetailEntry } from "~/types/note";

export async function listNotesByIdeaId(ideaId: string) {
	return db.note.findMany({
		where: { ideaId },
		orderBy: { createdAt: "desc" },
		select: ListNoteEntry,
	});
}

export async function getNoteById(id: string) {
	return db.note.findUnique({
		where: { id },
		select: NoteDetailEntry,
	});
}
