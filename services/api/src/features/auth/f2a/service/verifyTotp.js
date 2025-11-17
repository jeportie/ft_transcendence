// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyTotp.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/11/02 22:29:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { AuthErrors, F2AErrors } from "../../errors.js";

export async function verifyTotp(fastify, request, reply) {
    const getSecretSql = fastify.sql.f2a.getF2aSecret;
    const enableF2aSql = fastify.sql.f2a.enableF2a;

    const { code } = request.body || {};
    const userId = request.user?.sub;

    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(getSecretSql, { ":user_id": userId });
    if (!row || !row.f2a_secret)
        throw AuthErrors.UserNotFound(userId);

    const valid = authenticator.check(code, row.f2a_secret);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    // #TODO: add a option param in the body like a bool enable user and if false,
    // do not run the line below (we dont want to rewrite this every time we check
    // th user otp)
    await db.run(enableF2aSql, { ":user_id": userId });
    return { enabled: true };
}
