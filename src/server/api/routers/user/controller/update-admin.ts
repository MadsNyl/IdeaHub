import { TRPCError } from "@trpc/server";
import type { Prisma } from "generated/prisma";
import {
	type UpdateUserAdminInput,
	updateUserAdminSchema,
} from "~/schemas/user";
import { adminProcedure, type Controller } from "~/server/api/trpc";
import { UserAdminEntry } from "~/types/user";

const handler: Controller<
	UpdateUserAdminInput,
	Prisma.UserGetPayload<{ select: typeof UserAdminEntry }>
> = async ({ ctx, input }) => {
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
		select: UserAdminEntry,
	});

	return user;
};

export default adminProcedure.input(updateUserAdminSchema).mutation(handler);
