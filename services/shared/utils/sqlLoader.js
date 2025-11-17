
// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sqlLoader.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Updated: 2025/11/17                                  //
//                                                                            //
// ************************************************************************** //

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Base resolver: load an SQL file relative to a given module.
 * Works inside Docker, host environment, any working directory.
 */
export function resolveSql(importMetaUrl, relativeDir, file) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);

    const fullPath = path.join(__dirname, relativeDir, file);

    return fs.readFileSync(fullPath, "utf8");
}

/**
 * Alias to keep backward compatibility with automation tasks.
 * Behaves exactly like resolveSql.
 */
export function loadSql(importMetaUrl, relativePath) {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);

    const fullPath = path.join(__dirname, relativePath);

    return fs.readFileSync(fullPath, "utf8");
}

