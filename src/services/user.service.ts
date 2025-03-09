import db, { getData, getAllData } from "../plugins/db";

export interface IUser {
	id: number;
	full_name?: string;
	username?: string;
	tg_chat_id: number;
	reg: boolean;
}

export class UserService {
	static async getAllUsers(): Promise<any[]> {
		const { status, result, error } = await getAllData<any[]>(db, "SELECT * FROM users");
		if (status !== 1) {
			console.error("getAllUsers - error:");
			console.error(error);
			return [];
		}
		return result;
	};
	static CreateNewUser(full_name: string, username: string, chatId: number) {
		// Здесь оставил new Promise, т.к иногда нужно разные данные с этого запроса вытаскивать, но можешь также вынести в отдельную функицю
		return new Promise<number>((resolve, reject) => {
			db.run("INSERT INTO users (full_name, username, tg_chat_id, reg) VALUES (?, ?, ?, 0) ", [full_name, username, chatId], function (err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.lastID);
			});
		});
	}
	static async getUserInfoById(id: number): Promise<IUser | null> {
		// Перенёс конструкцию new Promise в отдельную функцию, чтобы не повторять код
		const res = await getData<IUser | null>(db, "SELECT * FROM users WHERE tg_chat_id = ?", [id]);
		if (!res.status) {
			console.error("getUserInfoById - error:");
			console.error(res.error);
			return null;
		}
		if (res === null) return null;
		const user = res.result as IUser;
		if (!user) return null;
		return { ...user, reg: (user?.reg as any) === 1 };
	}
	static async registerSecureUser(id: number): Promise<void> {
		const { result, error, status } = await getData(db, "UPDATE users SET reg = 1 WHERE tg_chat_id = ?", [id]);
		if (status !== 1) {
			console.error("registerSecureUser - error:");
			console.error(error);
			return;
		}
	}
}
