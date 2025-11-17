// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyBackup.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 13:33:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors, F2AErrors } from "../../errors.js";
import { issueSession } from "../../utils/issueSession.js";
import { verifyBackupCode } from "./verifyBackupCode.js";

const PATH = import.meta.url;

export async function verifyBackup(fastify, request, reply) {
    const findUserByIdSql = fastify.loadSql(PATH, "../sql/findUserById.sql");
    const { code, userId } = request.body || {};

    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const result = await verifyBackupCode(fastify, userId, code);

    if (result === "VALID") {
        const db = await fastify.getDb();
        const userRow = await db.get(findUserByIdSql, { ":id": userId });
        fastify.log.info(`[2FA] User ${userId} verified via BACKUP`);
        console.log(`[2FA] User ${userId} verified via BACKUP`);
        return issueSession(fastify, request, reply, userRow);
    }

    if (result === "USED") {
        throw F2AErrors.BackupExhausted();
    }

    throw F2AErrors.Invalid2FACode();
}
