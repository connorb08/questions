import { GenerateWord } from "./gemni";
import router from "./router";

export default {
	fetch: router.fetch,
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		console.log("cron processed");
		return await GenerateWord({} as Request, env);
	},
};

