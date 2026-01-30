import type { Prisma } from "generated/prisma";
import { type CreateIdeaInput, createIdeaSchema } from "~/schemas/idea";
import { type Controller, protectedProcedure } from "~/server/api/trpc";
import { ListIdeaEntry } from "~/types/idea";

const handler: Controller<
	CreateIdeaInput,
	Prisma.IdeaGetPayload<{ select: typeof ListIdeaEntry }>
> = async ({ ctx, input }) => {
	const { title, description } = input;

	const idea = await ctx.db.idea.create({
		data: {
			title,
			description,
			createdById: ctx.session.user.id,
		},
		select: ListIdeaEntry,
	});

	return idea;
};

export default protectedProcedure.input(createIdeaSchema).mutation(handler);
