import { bot } from '../../app';

interface IErrorMessage {
    message: string;
}

export function setupPetHandlers(): void {
    bot.hears('Питомец', async (ctx) => {
        const id = ctx.from.id;

        try {
            const response = await fetch(`http://localhost:3000/api/v1/pet/user/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                const errorData: IErrorMessage = JSON.parse(errorText);

                if (response.status === 404) {
                    await ctx.reply(errorData.message || 'Пользователь не найден.');
                } else {
                    await ctx.reply(`Ошибка: ${errorData.message}`);
                }
                return; 
            }
            const pet = await response.json();
            if (pet) {
                await ctx.reply(`Ваш питомец: ${pet.name}`);
            } else {
                await ctx.reply('У вас нет питомца.');
            }
        } catch (err) {
            console.error(err);
            await ctx.reply('Произошла ошибка на сервере.');
        }
    });
}