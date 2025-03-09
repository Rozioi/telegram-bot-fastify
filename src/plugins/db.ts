import sqlite3, { Database } from "sqlite3";

const db = new sqlite3.Database("./database/database.db");

db.serialize(() => {
	db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,  
            tg_chat_id INTEGER UNIQUE NOT NULL,  
            full_name TEXT,  
            reg BOOLEAN  
        )
    `);
});

interface ISuccessResponse<T> {
	status: 1;
	error: "";
	result: T;
}
interface IFailedResponse {
	status: 0;
	error: Error;
	result: null;
}
type IResponse<T> = ISuccessResponse<T> | IFailedResponse;

export async function getData<ReturnT>(db: Database, sql: string, values?: any[]) {
	return new Promise<IResponse<ReturnT>>((res, rej) => {
		if (values && Array.isArray(values)) {
			db.get(sql, values, (err, row: any) => {
				if (err) {
					rej({ status: 0, error: err, result: null });
					return; // Вообще эта строка необязательна, т.к после reject функция прекратит своё выполнение
				}
				res({ status: 1, error: "", result: row || null });
			});
			return;
		}

		db.get(sql, (err, row: any) => {
			if (err) {
				rej({ status: 0, error: err, result: null });
				return; // Вообще эта строка необязательна, т.к после reject функция прекратит своё выполнение
			}
			res({ status: 1, error: "", result: row || null });
		});
	});
}

export default db;
