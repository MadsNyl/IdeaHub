import type { Prisma } from "generated/prisma";
import {
	type UpdateUserVerificationInput,
	updateUserVerificationSchema,
} from "~/schemas/user";
import { adminProcedure, type Controller } from "~/server/api/trpc";
import { UserVerificationEntry } from "~/types/user";

const handler: Controller<
	UpdateUserVerificationInput,
	Prisma.UserGetPayload<{ select: typeof UserVerificationEntry }>
> = async ({ ctx, input }) => {
	const { userId, isVerified } = input;

	const user = await ctx.db.user.update({
		where: { id: userId },
		data: { isVerified },
		select: UserVerificationEntry,
	});

	return user;
};

export default adminProcedure
	.input(updateUserVerificationSchema)
	.mutation(handler);
