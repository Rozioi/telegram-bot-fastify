import { FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";
import { TRouteFunction } from "../utils/fastify-route";

interface IRequestBody {
	full_name: string;
	username: string;
	chatId: number;
}

function reqBodyValidaton(data: unknown): [IRequestBody, true] | [string, false] {
	if (!data) return ["data is null", false];
	if (typeof data !== "object" && typeof data === "string") {
		try {
			data = JSON.parse(data);
		} catch (err) {
			return ["failed to parse data", false];
		}
	}
	if (typeof data !== "object") {
		return ["data is incorrect", false];
	}

	var { full_name, username, chatId } = data as any;

	if (!full_name) return ["full_name is null", false];
	if (typeof full_name !== "string") return ["full_name must be a string", false];
	if (typeof username !== "string") return ["username must be a string", false];

	if (!chatId) return ["chat id is null", false];
	if (typeof chatId === "string") chatId = parseInt(chatId);
	if (typeof chatId !== "number" || Number.isNaN(chatId)) return ["chat id must be a number", false];

	return [{ full_name, username, chatId }, true];
}

export const UserRoutes: TRouteFunction = (fastify, _opts, done) => {
	fastify.get("/", async (req, reply) => {
		fastify.log.info("Запрос на получение всех пользователей");
		try {
			const users = await UserService.getAllUsers();
			return users;
		} catch (err) {
			fastify.log.error("Ошибка при получении пользователей:", err);
			reply.status(500).send({ error: "Database error" });
		}
	});
	fastify.post("/register", async (req: FastifyRequest<{ Body: IRequestBody }>, reply) => {
		try {
			const [body, isOk] = reqBodyValidaton(req.body);
			if (!isOk) return reply.status(400).send({ error: body });
			const { full_name, username, chatId } = body;

			const user = await UserService.getUserInfoById(chatId);
			if (!user) {
				const result = await UserService.CreateNewUser(full_name, username, chatId);
				return reply.status(201).send({ message: "Здравствуйте! Для верифицирования аккаунта используйте \n /reg!", id: result });
			}
			return reply.status(200).send({ message: "С возвращением" });
		} catch (err) {
			reply.status(500).send({ error: "Internal Server Error" });
		}
	});
	fastify.get("/reg/secure/user/:id", async (req: FastifyRequest<{ Params: { id: number } }>, reply) => {
		const { id } = req.params;
		if (Number.isNaN(parseInt(id as any))) return reply.status(400).send({ error: "user_id is not valid" });

		try {
			const result = await UserService.getUserInfoById(id);
			if (!result) {
				return reply.status(404).send({ message: "Пользователь не найден" });
			}
			if (result.reg) {
				return reply.status(200).send({ message: "Ваш аккаунт уже верифицирован" });
			}
			await UserService.registerSecureUser(id);
			return reply.status(201).send({ message: "Аккаунт успешно верифицирован" });
		} catch (err) {
			console.error("Ошибка при обработке запроса:", err);
			return reply.status(500).send({ message: "Произошла ошибка на сервере" });
		}
	});
	done();
};
