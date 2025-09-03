// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/03 14:57:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/03 15:24:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

const defaultDbFile = path.join(__dirname, "./data/app.db");

console.log(defaultDbFile);

let dbPromise = null;

async function ensureDirFor(file) {
    await fs.mkdir(path.dirname(file), { recursive: true });
};

async function runMigrations(db) {
    await db.exec("PRAGMA foreign_keys = ON;");

    // Ensure migrations registery
    await db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            run_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);

    const dir = path.join(__dirname, "migrations");
    let files = [];
    try {
        files = (await fs.readdir(dir))
            .filter((file) => file.endsWith(".sql"))
            .sort();
    } catch (error) {
        if (error.code === "ENOENT")
            return; // no migrations found
        throw error;
    };

    for (const file of files) {
        const applied = await db.get(
            "SELECT 1 FROM migrations WHERE name = ?",
            file
        );
        if (applied)
            continue;

        const sql = await fs.readFile(path.join(dir, file), "utf8");
        try {
            await db.exec("BEGIN;");
            await db.exec(sql);
            await db.run("INSERT INTO migrations (name) VALUES (?)", file);
            await db.exec("COMMIT;");
            console.log(`[DB] migration applied: ${file}`, err);
        } catch (error) {
            await db.exec("ROLLBACK;");
            console.error(`[DB] migration failed: ${file}`, err);
            throw err;
        }
    }
}

export async function getDb() {
    if (!dbPromise) {
        const file = defaultDbFile;
        await ensureDirFor(file);
        dbPromise = open({ filename: file, driver: sqlite3.Database });
        const db = await dbPromise;
        await runMigrations(db);
    }
    return (dbPromise);
}
