import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "~/env";
import { db } from "~/server/db";

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: "postgresql", // or "sqlite" or "mysql"
	}),
	baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
	trustedOrigins: [env.BETTER_AUTH_URL || "http://localhost:3000"],
	user: {
		additionalFields: {
			isAdmin: {
				type: "boolean",
				defaultValue: false,
			},
			isVerified: {
				type: "boolean",
				defaultValue: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders:
		env.BETTER_AUTH_GITHUB_CLIENT_ID && env.BETTER_AUTH_GITHUB_CLIENT_SECRET
			? {
					github: {
						clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
						clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
						redirectURI: `${env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/github`,
					},
				}
			: {},
});

export type Session = typeof auth.$Infer.Session;
