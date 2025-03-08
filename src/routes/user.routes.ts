import { FastifyRequest } from "fastify";
import { TRouteFunction } from "../utils/fastify-route";

import { UserService } from "../services/user.service";


interface IRequestBody {
  full_name: string;
  username: string;
  chatId: number;
}


export const UserRoutes: TRouteFunction = (fastify, _opts, _next) => {
  fastify.get('/', async (req: FastifyRequest, reply) => {
    fastify.log.info('Запрос на получение всех пользователей');
    try {
      const users = await UserService.getAllUsers();
      return users;
    } catch (err) {
      fastify.log.error('Ошибка при получении пользователей:', err);
      reply.status(500).send({ error: 'Database error' });
    }
  });
  fastify.post('/register', async (req: FastifyRequest<{ Body: IRequestBody }>, reply) => {
    try {
      const { full_name, username, chatId } = req.body;
      const user = await UserService.getUserInfoById(chatId);
      if (user) {
        return reply.status(200).send({ message: 'С возвращением' })
      }
      const result = await UserService.CreateNewUser(full_name, username, chatId);
      return reply.status(201).send({ message: 'Здравствуйте  , для верифицирования аккаунта используйте \n /reg!', id: result });
    } catch (err) {
      reply.status(500).send({ error: 'Internal Server Error' })
    }
  });
  fastify.get('/reg/secure/user/:id', async (req: FastifyRequest<{ Params: { id: number } }>, reply) => {
    const { id } = req.params;

    try {
      const result = await UserService.getUserInfoById(id);
      if (!result) {
        return reply.status(404).send({ message: 'Пользователь не найден' });
      }
      if (result.reg) {
        return reply.status(200).send({ message: 'Ваш аккаунт уже верифицирован' });
      }
      await UserService.registerSecureUser(id);
      return reply.status(201).send({ message: 'Аккаунт успешно верифицирован' });
    } catch (err) {
      console.error('Ошибка при обработке запроса:', err);
      return reply.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  });
  _next();
};