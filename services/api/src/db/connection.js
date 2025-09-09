// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   connection.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/03 14:57:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/03 17:02:29 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DB_FILE
    ? process.env.DB_FILE
    : path.join(__dirname, "./data/app.db");

let dbPromise = null;

console.log("[DB] Using file:", dbFile);
export async function ensureDirFor(file) {
    await fs.mkdir(path.dirname(file), { recursive: true });
};

export async function getDb() {
    if (!dbPromise) {
        await ensureDirFor(dbFile);
        dbPromise = open({ filename: dbFile, driver: sqlite3.Database });
    }
    return (dbPromise);
}
