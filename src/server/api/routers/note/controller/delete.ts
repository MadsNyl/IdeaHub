import { TRPCError } from "@trpc/server";
import { type DeleteNoteInput, deleteNoteSchema } from "~/schemas/note";
import { type Controller, protectedProcedure } from "~/server/api/trpc";

const handler: Controller<DeleteNoteInput, { success: boolean }> = async ({
	ctx,
	input,
}) => {
	const { id } = input;

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

	await ctx.db.note.delete({
		where: { id },
	});

	return { success: true };
};

export default protectedProcedure.input(deleteNoteSchema).mutation(handler);
