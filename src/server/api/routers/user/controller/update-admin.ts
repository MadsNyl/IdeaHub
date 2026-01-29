import { TRPCError } from "@trpc/server";

import { updateUserAdminSchema } from "~/schemas/user";
import { adminProcedure } from "~/server/api/trpc";

export const updateAdmin = adminProcedure
	.input(updateUserAdminSchema)
	.mutation(async ({ ctx, input }) => {
		const { userId, isAdmin } = input;

		// Prevent admin from removing their own admin status
		if (userId === ctx.session.user.id && !isAdmin) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "You cannot remove your own admin status",
			});
		}

		const user = await ctx.db.user.update({
			where: { id: userId },
			data: { isAdmin },
			select: {
				id: true,
				name: true,
				email: true,
				isAdmin: true,
			},
		});

		return user;
	});
