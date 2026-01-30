import { z } from "zod";

export const noteTypeSchema = z.enum([
	"RESEARCH",
	"MEETING",
	"FEEDBACK",
	"TASK",
	"BRAINSTORM",
	"REFERENCE",
]);

export const createNoteSchema = z.object({
	ideaId: z.string(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be 200 characters or less"),
	description: z.string().min(1, "Description is required"),
	type: noteTypeSchema,
});

export const updateNoteSchema = z.object({
	id: z.string(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be 200 characters or less"),
	description: z.string().min(1, "Description is required"),
	type: noteTypeSchema,
});

export const deleteNoteSchema = z.object({
	id: z.string(),
});

export const getNoteSchema = z.object({
	id: z.string(),
});

export type NoteType = z.infer<typeof noteTypeSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
export type GetNoteInput = z.infer<typeof getNoteSchema>;
