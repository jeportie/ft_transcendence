// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyBackupCode.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 15:44:02 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 16:01:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "../utils/password.js";
import { loadSql } from "../../../../utils/sqlLoader.js";

const PATH = import.meta.url;
const getBackupCodesSql = loadSql(PATH, "../sql/getBackupCodes.sql");
const useBackupCodeSql = loadSql(PATH, ".../sql/useBackupCode.sql");

export async function verifyBackupCode(fastify, userId, rawCode) {
    if (!userId || !rawCode)
        return (false);

    const db = await fastify.getDb();
    const codes = db.get(getBackupCodesSql, { ":user_id": userId });

    for (const code of codes) {
        const match = await verifyPassword(code.code_hash, rawCode);
        if (match) {
            await db.run(useBackupCodeSql, {
                ":user_id": userId,
                ":id": code.id,
            });
            return (true);
        }
    }
    return (false);
}
