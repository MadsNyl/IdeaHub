import { z } from "zod";

export const updateUserVerificationSchema = z.object({
	userId: z.string(),
	isVerified: z.boolean(),
});

export const updateUserAdminSchema = z.object({
	userId: z.string(),
	isAdmin: z.boolean(),
});

export const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export type UpdateUserVerificationInput = z.infer<
	typeof updateUserVerificationSchema
>;
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
