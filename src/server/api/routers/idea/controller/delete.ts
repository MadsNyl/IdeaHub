import { TRPCError } from "@trpc/server";
import { type DeleteIdeaInput, deleteIdeaSchema } from "~/schemas/idea";
import { type Controller, protectedProcedure } from "~/server/api/trpc";

const handler: Controller<DeleteIdeaInput, { success: boolean }> = async ({
	ctx,
	input,
}) => {
	const { id } = input;

	const existing = await ctx.db.idea.findFirst({
		where: {
			id,
			createdById: ctx.session.user.id,
		},
	});

	if (!existing) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Idea not found",
		});
	}

	await ctx.db.idea.delete({
		where: { id },
	});

	return { success: true };
};

export default protectedProcedure.input(deleteIdeaSchema).mutation(handler);
