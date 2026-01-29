import { createIdeaSchema } from "~/schemas/idea";
import { protectedProcedure } from "~/server/api/trpc";

export const create = protectedProcedure
	.input(createIdeaSchema)
	.mutation(async ({ ctx, input }) => {
		const { title, description } = input;

		const idea = await ctx.db.idea.create({
			data: {
				title,
				description,
				createdById: ctx.session.user.id,
			},
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
			},
		});

		return idea;
	});
