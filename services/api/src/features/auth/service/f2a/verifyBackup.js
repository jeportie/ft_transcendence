// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyBackup.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:46:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors, F2AErrors } from "../../errors.js";
import { issueSession } from "../utils/issueSession.js";
import { verifyBackupCode } from "./verifyBackupCode.js";

const PATH = import.meta.url;
const findUserByIdSql = loadSql(PATH, "../sql/findUserById.sql");

export async function verifyBackup(fastify, request, reply) {
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
