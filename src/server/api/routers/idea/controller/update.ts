import { TRPCError } from "@trpc/server";
import { updateIdeaSchema } from "~/schemas/idea";
import { protectedProcedure } from "~/server/api/trpc";

export const update = protectedProcedure
	.input(updateIdeaSchema)
	.mutation(async ({ ctx, input }) => {
		const { id, title, description } = input;

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

		const idea = await ctx.db.idea.update({
			where: { id },
			data: {
				title,
				description,
			},
			select: {
				id: true,
				title: true,
				description: true,
				updatedAt: true,
			},
		});

		return idea;
	});
