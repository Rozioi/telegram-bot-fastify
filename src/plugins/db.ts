import sqlite3, { Database } from "sqlite3";

const db = new sqlite3.Database("./database/database.db");



db.serialize(() => {
	db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,  
            tg_chat_id INTEGER UNIQUE NOT NULL,  
            full_name TEXT,  
            reg BOOLEAN  
        )
    `);
	db.run(`
		CREATE TABLE IF NOT EXISTS pets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		species TEXT,
		breed TEXT,
		age INTEGER,
		user_id INTEGER NOT NULL,
		second_user_id INTEGER,
		FOREIGN KEY (user_id) REFERENCES users(tg_chat_id) ON DELETE CASCADE,
		FOREIGN KEY (second_user_id) REFERENCES users(tg_chat_id) ON DELETE SET NULL
		)
		`)
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

export async function getAllData<ReturnT>(db: Database, sql: string, values?: any[]): Promise<IResponse<ReturnT[]>> {
    return new Promise<IResponse<ReturnT[]>>((res, rej) => {
        db.all(sql, values || [], (err, rows: ReturnT[]) => {
            if (err) {
                console.error("Database error in getAllData:", err);
                rej({ status: 0, error: err, result: [] });
                return;
            }
            res({ status: 1, error: "", result: rows });
        });
    });
}

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
