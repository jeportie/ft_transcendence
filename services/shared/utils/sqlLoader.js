// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sqlLoader.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/26 12:12:29 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 12:17:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Load a .sql file relative to the caller's module.
 *
 * @param {string} importMetaUrl - usually `import.meta.url` from caller
 * @param {string} relativePath - path to the .sql file, relative to caller
 * @returns {string} SQL query as string
 */
export function loadSql(importMetaUrl, relativePath) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);
    const sqlPath = path.join(__dirname, relativePath);

    return (readFileSync(sqlPath, "utf8"));
}
