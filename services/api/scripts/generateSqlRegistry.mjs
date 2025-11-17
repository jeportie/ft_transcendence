// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   generateSqlRegistry.mjs                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/17 14:55:12 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 15:06:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../src/features/auth");

/**
 * Clean + minify SQL:
 * - Remove "-- ..." comments
 * - Remove /* ... *\/ block comments
 * - Remove newlines
 * - Collapse multiple spaces
 */
function cleanSql(sql) {
    return sql
        // Remove -- comments
        .replace(/^--.*$/gm, "")
        // Remove /* */ comments
        .replace(/\/\*[\s\S]*?\*\//gm, "")
        // Remove newlines entirely
        .replace(/\r?\n/g, " ")
        // Collapse multiple spaces
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Recursively scan ONLY folders named "sql".
 */
function scanForSqlFolders(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let groups = {};

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === "sql") {
                groups = { ...groups, ...readSqlFiles(fullPath) };
            } else {
                const nested = scanForSqlFolders(fullPath);
                if (Object.keys(nested).length > 0) {
                    groups[entry.name] = nested;
                }
            }
        }
    }
    return groups;
}

/**
 * Load and clean SQL files.
 */
function readSqlFiles(sqlDir) {
    const files = fs.readdirSync(sqlDir);
    let result = {};

    for (const file of files) {
        if (!file.endsWith(".sql")) continue;

        const key = file.replace(".sql", "");
        const raw = fs.readFileSync(path.join(sqlDir, file), "utf8");
        const clean = cleanSql(raw);

        result[key] = clean;
    }

    return result;
}

const sqlRegistry = scanForSqlFolders(ROOT);

// Output file
const outputFile = path.resolve(__dirname, "../src/utils/sqlRegistry.generated.js");

const output = `// AUTO-GENERATED — DO NOT EDIT
export const sql = ${JSON.stringify(sqlRegistry, null, 2)};
`;

fs.writeFileSync(outputFile, output);
console.log("[SQL Registry] Generated (minified SQL):", outputFile);
