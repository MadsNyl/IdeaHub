import { TRPCError } from "@trpc/server";
import type { Prisma } from "generated/prisma";
import { type GetNoteInput, getNoteSchema } from "~/schemas/note";
import { type Controller, protectedProcedure } from "~/server/api/trpc";
import { NoteDetailEntry } from "~/types/note";

const handler: Controller<
	GetNoteInput,
	Prisma.NoteGetPayload<{ select: typeof NoteDetailEntry }>
> = async ({ ctx, input }) => {
	const { id } = input;

	// Verify the user owns the idea that contains this note
	const note = await ctx.db.note.findFirst({
		where: {
			id,
			idea: {
				createdById: ctx.session.user.id,
			},
		},
		select: NoteDetailEntry,
	});

	if (!note) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Note not found or access denied",
		});
	}

	return note;
};

export default protectedProcedure.input(getNoteSchema).query(handler);
