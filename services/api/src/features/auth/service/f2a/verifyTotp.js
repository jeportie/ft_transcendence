// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyTotp.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:47:04 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors, F2AErrors } from "../../errors.js";

const PATH = import.meta.url;
const getSecretSql = loadSql(PATH, "../sql/getF2aSecret.sql");
const enableF2aSql = loadSql(PATH, "../sql/enableF2a.sql");

export async function verifyTotp(fastify, request, reply) {

    const { code } = request.body || {};
    const userId = request.user?.id;

    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(getSecretSql, { ":user_id": userId });
    if (!row || !row.f2a_secret)
        throw AuthErrors.UserNotFound(userId);

    const valid = authenticator.check(code, row.f2a_secret);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    await db.run(enableF2aSql, { ":user_id": userId });
    return { enabled: true };
}
