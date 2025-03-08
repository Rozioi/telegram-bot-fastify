import { bot } from "../app"
import { Message } from "node-telegram-bot-api";

export const setupBotHandlers = async () => {
    bot.onText(/\/users/, async (msg: Message) => {
        const chatId = msg.chat.id;
        try {
            const response = await fetch('http://localhost:3000/api/v1/');
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }
            const users = await response.json();
            const userList = users
                .map((user: any) => `ID: ${user.id}, Full name: ${user.full_name}, Username: ${user.username}, Register: ${user.reg === 1}`)
                .join('\n') || 'Пользователи не найдены';
            await bot.sendMessage(chatId, userList);
        } catch (err) { }
    });
    bot.onText(/\/start/, async (msg: Message) => {
        const { first_name, last_name, username, id } = msg.chat;
        const full_name = `${first_name}` + `${last_name}`;
        try {
            const response = await fetch('http://localhost:3000/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: full_name,
                    username: username,
                    chatId: id
                })
            });
            const res = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
            if (response.ok) {
                await bot.sendMessage(id, `${res.message}`);
            } else {
                const error = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
                const errorMessage = error.message.includes("параметр")
                    ? "❌ Недостаточно данных: укажите username и имя"
                    : "❌ Ошибка регистрации: " + error.message;

                await bot.sendMessage(id, errorMessage);
            }

        } catch (err) { }
    });
    bot.onText(/\/reg/, async (msg: Message) => {
        const { id } = msg.chat;
        try{
            const response = await fetch(`http://localhost:3000/api/v1/reg/secure/user/${id}`);
            if (response.ok) {
                const data = await response.json(); 
                await bot.sendMessage(id, data.message || "✅ Регистрация прошла успешно!");
            } else {
                const errorData = await response.json().catch(() => ({ message: "Неизвестная ошибка" }));
                const errorMessage = errorData.message || "❌ Ошибка при регистрации";
                await bot.sendMessage(id, errorMessage);
            }
        } catch (err) {
            console.error("Ошибка при регистрации:", err);
            await bot.sendMessage(id, "🚫 Произошла ошибка при подключении к серверу");
        }
    });
}