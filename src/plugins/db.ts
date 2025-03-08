import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database/database.db');

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

export default db;