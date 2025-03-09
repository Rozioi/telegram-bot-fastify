import { bot } from "../app";
import { IUser } from "../services/user.service";

function userMapper(user: IUser): string {
	// Return sting format: "Id: 1, Full name: MyName, ..."
	return [`ID: ${user.id}`, `Full name: ${user.full_name}`, `Username: ${user.username}`, `Register: ${!!user.reg}`].join(", ");
}
export function setupBotHandlers(): void {
	bot.command("users", async ctx => {
		try {
			const response = await fetch("http://localhost:3000/api/v1/");
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
			const response = await fetch("http://localhost:3000/api/v1/register", {
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
		try {
			const id = ctx.from.id;
			const response = await fetch(`http://localhost:3000/api/v1/reg/secure/user/${id}`);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
				const errorMessage = errorData.message || "❌ Ошибка при регистрации";
				return await ctx.reply(errorMessage);
			}
			const data = await response.json();
			return await ctx.reply(data.message || "✅ Регистрация прошла успешно!");
		} catch (err) {
			console.error("Ошибка при регистрации:", err);
			await ctx.reply("🚫 Произошла ошибка при подключении к серверу");
		}
	});
	bot.launch();
}
