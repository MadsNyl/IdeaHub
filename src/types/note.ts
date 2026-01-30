import { Prisma } from "generated/prisma";

export const ListNoteEntry = Prisma.validator<Prisma.NoteSelect>()({
	id: true,
	title: true,
	type: true,
	createdAt: true,
});

export const NoteDetailEntry = Prisma.validator<Prisma.NoteSelect>()({
	id: true,
	title: true,
	description: true,
	type: true,
	createdAt: true,
	updatedAt: true,
});
