import { Markup } from "telegraf";
import { bot } from "../../app";
import { IUser } from "../../services/user.service";

function userMapper(user: IUser): string {
	return [`ID: ${user.id}`, `Full name: ${user.full_name}`, `Username: ${user.username}`, `Register: ${!!user.reg}`].join(", ");
}

export function setupUserHandlers (): void {
    bot.command("users", async ctx => {
		try {
			const response = await fetch("http://localhost:3000/api/v1/user/");
			if (!response.ok) {
				throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
			}
			const users = await response.json();
			const userList = users.map(userMapper).join("\n") || "Пользователи не найдены";
			
			return await ctx.reply(userList);

		} catch (err) {
			console.error(err);
		}
	});
	bot.command("start", async ctx => {
		const { first_name, last_name, username, id } = ctx.from;
		const full_name = `${first_name ?? ''}` + `${last_name ?? ''}`;
		try {
			const response = await fetch("http://localhost:3000/api/v1/user/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					full_name: full_name,
					username: username ?? '',
					chatId: id,
				}),
			});
			
			const res = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
				const errorMessage = error.message.includes("параметр") ? "❌ Недостаточно данных: укажите username и имя" : "❌ Ошибка регистрации: " + error.message;
				return await ctx.reply(errorMessage);
			}
			return await ctx.reply(res.message);
		} catch (err) {}
	});
	bot.command("reg", async ctx => {
		const Keyboard = Markup.keyboard(['Питомец', 'button12']).resize();
		try {
			const id = ctx.from.id;
			const response = await fetch(`http://localhost:3000/api/v1/user/reg/secure/user/${id}`);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
				const errorMessage = errorData.message || "❌ Ошибка при регистрации";
				return await ctx.reply(errorMessage);
			}
			const data = await response.json();
			await ctx.reply(data.message || "✅ Регистрация прошла успешно!");
			await ctx.reply('Начните пользоваться всеми возможностями', Keyboard);
		} catch (err) {
			console.error("Ошибка при регистрации:", err);
			await ctx.reply("🚫 Произошла ошибка при подключении к серверу");
		}
	});
}