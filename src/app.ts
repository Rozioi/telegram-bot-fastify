import Fastify from "fastify";
import { Context, Telegraf } from "telegraf";
import { config } from "./config/env";
import { UserRoutes } from "./routes/user.routes";
import { FastifyRoute } from "./utils/fastify-route";
export const app = Fastify({
	logger: true,
});
export const bot: Telegraf<Context> = new Telegraf(config.telegramBotToken);

app.addHook("onReady", async () => {});

FastifyRoute(
	{
		fastify: app,
	},
	UserRoutes,
	{ prefix: "/api/v1" }
);
