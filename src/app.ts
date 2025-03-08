import Fastify from "fastify";
import {FastifyRoute} from "./utils/fastify-route";
import {UserRoutes} from "./routes/user.routes";
import TgBot, {Message} from 'node-telegram-bot-api';
import {config} from "./config/env";
export const app = Fastify({
    logger: true
});
export const bot = new TgBot(config.telegramBotToken, { polling: true});

app.addHook('onReady', async () => {
    
});

FastifyRoute({
    fastify: app
},UserRoutes, {prefix: '/api/v1'})
