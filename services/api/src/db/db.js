// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 14:33:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:40:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

sqlite3.verbose();

let db = null;

export async function getDb() {
    if (db) return db;
    db = await open({
        filename: '/data/app.db', // map a volume here in compose if you want persistence
        driver: sqlite3.Database
    });

    /** Health check table */
    await db.exec(`
CREATE TABLE IF NOT EXISTS health (
  id INTEGER PRIMARY KEY,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
  `);

    /** User table */
    await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,              -- null for pure OAuth later
  display_name TEXT,
  is_2fa_enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
  `);

    const row = await db.get('SELECT * FROM health WHERE id = 1');
    if (!row) {
        await db.run('INSERT INTO health (id, status, updated_at) VALUES (1, ?, ?)', [
            'ok', new Date().toISOString()
        ]);
    }
    return db;
}
