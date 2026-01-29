import { TRPCError } from "@trpc/server";
import { deleteIdeaSchema } from "~/schemas/idea";
import { protectedProcedure } from "~/server/api/trpc";

export const deleteIdea = protectedProcedure
	.input(deleteIdeaSchema)
	.mutation(async ({ ctx, input }) => {
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
	});
