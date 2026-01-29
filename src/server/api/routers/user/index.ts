import { createTRPCRouter } from "~/server/api/trpc";

import { updateAdmin } from "./controller/update-admin";
import { updateVerification } from "./controller/update-verification";

export const userRouter = createTRPCRouter({
	updateVerification,
	updateAdmin,
});
