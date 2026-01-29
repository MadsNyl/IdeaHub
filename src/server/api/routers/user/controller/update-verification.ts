import { updateUserVerificationSchema } from "~/schemas/user";
import { adminProcedure } from "~/server/api/trpc";

export const updateVerification = adminProcedure
	.input(updateUserVerificationSchema)
	.mutation(async ({ ctx, input }) => {
		const { userId, isVerified } = input;

		const user = await ctx.db.user.update({
			where: { id: userId },
			data: { isVerified },
			select: {
				id: true,
				name: true,
				email: true,
				isVerified: true,
			},
		});

		return user;
	});
