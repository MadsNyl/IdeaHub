import { TRPCError } from "@trpc/server";
import type { Prisma } from "generated/prisma";
import { type UpdateIdeaInput, updateIdeaSchema } from "~/schemas/idea";
import { type Controller, protectedProcedure } from "~/server/api/trpc";
import { UpdateIdeaEntry } from "~/types/idea";

const handler: Controller<
	UpdateIdeaInput,
	Prisma.IdeaGetPayload<{ select: typeof UpdateIdeaEntry }>
> = async ({ ctx, input }) => {
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
		select: UpdateIdeaEntry,
	});

	return idea;
};

export default protectedProcedure.input(updateIdeaSchema).mutation(handler);
