// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   migrations.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/03 14:57:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/03 17:02:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations(db) {
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
            console.log(`[DB] migration applied: ${file}`);
        } catch (error) {
            await db.exec("ROLLBACK;");
            console.error(`[DB] migration failed: ${file}`, error);
            throw error;
        }
    }
}
