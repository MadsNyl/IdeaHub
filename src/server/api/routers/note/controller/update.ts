import { TRPCError } from "@trpc/server";
import type { Prisma } from "generated/prisma";
import { type UpdateNoteInput, updateNoteSchema } from "~/schemas/note";
import { type Controller, protectedProcedure } from "~/server/api/trpc";
import { NoteDetailEntry } from "~/types/note";

const handler: Controller<
	UpdateNoteInput,
	Prisma.NoteGetPayload<{ select: typeof NoteDetailEntry }>
> = async ({ ctx, input }) => {
	const { id, title, description, type } = input;

	// Verify the user owns the idea that contains this note
	const note = await ctx.db.note.findFirst({
		where: {
			id,
			idea: {
				createdById: ctx.session.user.id,
			},
		},
		select: { id: true },
	});

	if (!note) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Note not found or access denied",
		});
	}

	const updatedNote = await ctx.db.note.update({
		where: { id },
		data: {
			title,
			description,
			type,
		},
		select: NoteDetailEntry,
	});

	return updatedNote;
};

export default protectedProcedure.input(updateNoteSchema).mutation(handler);
