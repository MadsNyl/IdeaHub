import { Prisma } from "generated/prisma";

export const ListIdeaEntry = Prisma.validator<Prisma.IdeaSelect>()({
	id: true,
	title: true,
	description: true,
	createdAt: true,
});

export const UpdateIdeaEntry = Prisma.validator<Prisma.IdeaSelect>()({
	id: true,
	title: true,
	description: true,
	updatedAt: true,
});
