// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyF2a.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 00:34:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors, F2AErrors } from "../../errors.js";
import { issueSession } from "../utils/issueSession.js";
import { verifyBackupCode } from "./verifyBackupCode.js";

const PATH = import.meta.url;
const getSecretSql = loadSql(PATH, "../sql/getF2aSecret.sql");
const enableF2aSql = loadSql(PATH, "../sql/enableF2a.sql");
const findUserByIdSql = loadSql(PATH, "../sql/findUserById.sql");

export async function verifyF2a(fastify, userId, code, request, reply) {
    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(getSecretSql, { ":user_id": userId });
    if (!row || !row.f2a_secret)
        throw AuthErrors.UserNotFound(userId);

    // TOTP check
    let valid = authenticator.check(code, row.f2a_secret);
    if (!valid)
        valid = await verifyBackupCode(fastify, userId, code);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    await db.run(enableF2aSql, { ":user_id": userId });

    // Get the whole User row:
    const userRow = await db.get(findUserByIdSql, { ":id": userId });
    return issueSession(fastify, request, reply, userRow);
}
