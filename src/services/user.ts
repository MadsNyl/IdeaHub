import { db } from "~/server/db";

interface ListUsersParams {
	search?: string;
	page?: number;
	limit?: number;
}

export async function listUsers({
	search,
	page = 1,
	limit = 10,
}: ListUsersParams = {}) {
	const skip = (page - 1) * limit;

	const where = search
		? {
				OR: [
					{ name: { contains: search, mode: "insensitive" as const } },
					{ email: { contains: search, mode: "insensitive" as const } },
				],
			}
		: {};

	const [users, total] = await Promise.all([
		db.user.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				isAdmin: true,
				isVerified: true,
				createdAt: true,
			},
		}),
		db.user.count({ where }),
	]);

	return {
		users,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

export async function getUserAccounts(userId: string) {
	return db.account.findMany({
		where: { userId },
		select: {
			id: true,
			providerId: true,
			accountId: true,
			createdAt: true,
		},
	});
}

export async function getUserSessions(userId: string) {
	return db.session.findMany({
		where: {
			userId,
			expiresAt: { gt: new Date() },
		},
		select: {
			id: true,
			token: true,
			ipAddress: true,
			userAgent: true,
			createdAt: true,
			expiresAt: true,
		},
		orderBy: { createdAt: "desc" },
	});
}
