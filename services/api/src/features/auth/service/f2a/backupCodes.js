// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   backupCodes.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 12:30:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:57:29 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";
import { hashPassword } from "../utils/password.js"
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors, F2AErrors } from "../../errors.js";

const PATH = import.meta.url;
const deleteBackupCodeSql = loadSql(PATH, "../sql/deleteBackupCode.sql");
const generateBackupCodesSql = loadSql(PATH, "../sql/insertBackupCodes.sql");

export async function generateBackupCodes(fastify, userId, count = 10) {
    if (!userId)
        throw AuthErrors.MissingCredentials();

    try {
        const db = await fastify.getDb();
        await db.run(deleteBackupCodeSql, { ":user_id": userId });

        const codes = [];
        for (let i = 0; i < count; i++) {
            const raw = crypto.randomBytes(4).toString("hex");
            const hash = hashPassword(raw);
            codes.push({ raw, hash });
        }

        // classic SQLite patterns:
        // prepare(file.sql) -> prepare statement of actions to do in the db
        // statement.run() run file.sql in the statement
        // statement.finalize() puch the statement to the db
        const statement = await db.prepare(generateBackupCodesSql);
        try {
            for (const code of codes) {
                await statement.run({
                    ":user_id": userId,
                    ":code_hash": code.hash,
                });
            }
        } finally {
            await statement.finalize();
        }
        return codes.map(code => code.raw);
    } catch (err) {
        throw F2AErrors.BackupGenerateFailed();
    }
}
