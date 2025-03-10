import Fastify from "fastify";
import { Context, Telegraf } from "telegraf";
import { config } from "./config/env";
import { UserRoutes } from "./routes/user.routes";
import { FastifyRoute } from "./utils/fastify-route";
import { PetRoutes } from "./routes/pet.routes";
export const app = Fastify({
	logger: true,
});
export const bot: Telegraf<Context> = new Telegraf(config.telegramBotToken);

app.addHook("onReady", async () => {await bot.telegram.sendMessage(7044218203,'Технический перерыв закончен')});

FastifyRoute(
	{
		fastify: app,
	},
	UserRoutes,
	{ prefix: "/api/v1/user" }
);
FastifyRoute(
	{
		fastify: app,
	},
	PetRoutes,
	{ prefix: "/api/v1/pet"}
)