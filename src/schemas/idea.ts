import { z } from "zod";

export const createIdeaSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be 200 characters or less"),
	description: z.string().min(1, "Description is required"),
});

export const updateIdeaSchema = z.object({
	id: z.string(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be 200 characters or less"),
	description: z.string().min(1, "Description is required"),
});

export const deleteIdeaSchema = z.object({
	id: z.string(),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type DeleteIdeaInput = z.infer<typeof deleteIdeaSchema>;
