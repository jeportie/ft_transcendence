// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyBackupCode.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 15:44:02 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:46:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function verifyBackupCode(fastify, userId, rawCode) {
    if (!userId || !rawCode)
        return ("INVALID");

    const getBackupCodesSql = fastify.sql.f2a.getBackupCodes;
    const useBackupCodeSql = fastify.sql.f2a.useBackupCode;

    const db = await fastify.getDb();
    const codes = await db.all(getBackupCodesSql, { ":user_id": userId });

    for (const code of codes) {
        const match = await fastify.verifyPassword(code.code_hash, rawCode);
        if (match) {
            if (code.used_at)
                return ("USED");
            const result = await db.run(useBackupCodeSql, {
                ":user_id": userId,
                ":id": code.id,
            });
            if (result.changes === 1) {
                return ("VALID");
            }
        }
    }
    return ("INVALID");
}
