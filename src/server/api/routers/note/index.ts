import { createTRPCRouter } from "~/server/api/trpc";

import create from "./controller/create";
import deleteNote from "./controller/delete";
import get from "./controller/get";
import update from "./controller/update";

export const noteRouter = createTRPCRouter({
	create,
	update,
	delete: deleteNote,
	get,
});
