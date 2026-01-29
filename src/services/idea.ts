import { db } from "~/server/db";

interface ListIdeasParams {
	userId: string;
	search?: string;
	page?: number;
	limit?: number;
}

export async function listIdeas({
	userId,
	search,
	page = 1,
	limit = 10,
}: ListIdeasParams) {
	const skip = (page - 1) * limit;

	const where = {
		createdById: userId,
		...(search && {
			OR: [
				{ title: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			],
		}),
	};

	const [ideas, total] = await Promise.all([
		db.idea.findMany({
			where,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
		db.idea.count({ where }),
	]);

	return {
		ideas,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

interface GetIdeaParams {
	id: string;
	userId: string;
}

export async function getIdea({ id, userId }: GetIdeaParams) {
	return db.idea.findFirst({
		where: {
			id,
			createdById: userId,
		},
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function getIdeaById(id: string) {
	return db.idea.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
			updatedAt: true,
			createdBy: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});
}
