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
import { use } from "react";

const DOMAIN = import.meta.url;
const getSecretSql = loadSql(DOMAIN, "../sql/getF2aSecret.sql");
const enableF2aSql = loadSql(DOMAIN, "../sql/enableF2a.sql");

export async function verifyF2a(fastify, userId, code) {
    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(getSecretSql, { ":user_id": userId });
    if (!row || !row.f2a_secret)
        throw AuthErrors.UserNotFound(userId);

    const valid = authenticator.check(code, row.f2a_secret);
    if (!valid)
        throw new Error("Invalid 2FA code"); // TODO: put this in console.error();

    await db.run(enableF2aSql, { ":user_id": userId });
}
