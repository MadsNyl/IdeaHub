import { createTRPCRouter } from "~/server/api/trpc";

import create from "./controller/create";
import deleteIdea from "./controller/delete";
import update from "./controller/update";

export const ideaRouter = createTRPCRouter({
	create,
	update,
	delete: deleteIdea,
});
