import { z } from "zod";

export const updateUserVerificationSchema = z.object({
	userId: z.string(),
	isVerified: z.boolean(),
});

export const updateUserAdminSchema = z.object({
	userId: z.string(),
	isAdmin: z.boolean(),
});

export type UpdateUserVerificationInput = z.infer<
	typeof updateUserVerificationSchema
>;
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
