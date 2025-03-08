import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({path: envPath});

const envSchema = z.object({
    PORT: z.string().min(1).default('3000'),
    TELEGRAM_BOT_TOKEN: z.string().min(1),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error('❌ Ошибка валидации переменных окружения:', env.error.format());
    throw new Error('Некорректные переменные окружения');
}

type Config = {
    port: number;
    telegramBotToken: string;
};

export const config: Config = {
    port: parseInt(env.data.PORT, 10), 
    telegramBotToken: env.data.TELEGRAM_BOT_TOKEN,
};