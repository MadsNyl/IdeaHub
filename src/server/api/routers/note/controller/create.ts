import { TRPCError } from "@trpc/server";
import type { Prisma } from "generated/prisma";
import { type CreateNoteInput, createNoteSchema } from "~/schemas/note";
import { type Controller, protectedProcedure } from "~/server/api/trpc";
import { ListNoteEntry } from "~/types/note";

const handler: Controller<
	CreateNoteInput,
	Prisma.NoteGetPayload<{ select: typeof ListNoteEntry }>
> = async ({ ctx, input }) => {
	const { ideaId, title, description, type } = input;

	// Verify the user owns the idea
	const idea = await ctx.db.idea.findFirst({
		where: {
			id: ideaId,
			createdById: ctx.session.user.id,
		},
		select: { id: true },
	});

	if (!idea) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Idea not found or access denied",
		});
	}

	const note = await ctx.db.note.create({
		data: {
			title,
			description,
			type,
			ideaId,
		},
		select: ListNoteEntry,
	});

	return note;
};

export default protectedProcedure.input(createNoteSchema).mutation(handler);
