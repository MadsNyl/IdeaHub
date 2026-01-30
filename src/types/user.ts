import { Prisma } from "generated/prisma";

export const UserAdminEntry = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	name: true,
	email: true,
	isAdmin: true,
});

export const UserVerificationEntry = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	name: true,
	email: true,
	isVerified: true,
});
