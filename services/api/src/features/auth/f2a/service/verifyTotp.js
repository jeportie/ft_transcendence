// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyTotp.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:21:04 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { AuthErrors, F2AErrors } from "../../errors.js";

export async function verifyTotp(fastify, request, reply) {
    const userId = request.user?.sub;
    const { code } = request.body || {};
    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(
        fastify.sql.f2a.findMfaMethodByType,
        { ":user_id": userId, ":type": "totp" }
    );

    if (!row || !row.secret)
        throw AuthErrors.UserNotFound(userId);

    const valid = authenticator.check(code, row.secret);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    await db.run(fastify.sql.f2a.updateMfaMethod, {
        ":id": row.id,
        ":secret": row.secret,
        ":enabled": 1,
    });

    return { enabled: true };
}
