import { resolve } from 'path';
import db from '../plugins/db';

interface User {
    id: number;
    full_name?: string;
    username?: string;
    tg_chat_id: number;
    reg: boolean;
}

export class UserService {
    static getAllUsers(): Promise<any[]>{
        return new Promise((resolve,reject) => {
            db.all('SELECT * FROM users', (err, rows) => {
                if(err) reject(err);
                else resolve(rows);
            })
        })
    };
    static CreateNewUser(full_name:string, username:string, chatId: number): Promise<number>{
        return new Promise((resolve,reject) => {
            db.run('INSERT INTO users (full_name, username, tg_chat_id, reg) VALUES (?, ?, ?, 0) ', [full_name, username,chatId],  function(err) {
                if (err){
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            })
        })
    };
    static getUserInfoById(id: number): Promise<User | null>{
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE tg_chat_id = ?', [id] , (err,row: any) => {
                if (err){reject(err)}
                else {
                    if (row) {
                        row.reg = row.reg === 1;
                    }
                    resolve(row || null);
                };
            })
        })
    };
    static registerSecureUser(id:number): Promise<void>{
        return new Promise((resolve,reject) => {
            db.run('UPDATE users SET reg = 1 WHERE tg_chat_id = ?', [id], (err) => {
               if(err){reject(err)};
               resolve(); 
            })
        })
    }
}