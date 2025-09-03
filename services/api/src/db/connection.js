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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const defaultDbFile = path.join(__dirname, "./data/app.db");
console.log(defaultDbFile);

let dbPromise = null;

export async function ensureDirFor(file) {
    await fs.mkdir(path.dirname(file), { recursive: true });
};

export async function getDb() {
    if (!dbPromise) {
        await ensureDirFor(defaultDbFile);
        dbPromise = open({ filename: defaultDbFile, driver: sqlite3.Database });
    }
    return (dbPromise);
}
