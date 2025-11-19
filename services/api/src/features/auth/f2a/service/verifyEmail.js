// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyEmail.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/18 11:58:24 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:24:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors, F2AErrors } from "../../errors.js";

export async function verifyEmail(fastify, request, reply) {
    const userId = request.user?.sub;
    const { code } = request.body || {};
    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();

    const row = await db.get(fastify.sql.f2a.findEmailToken, {
        ":user_id": userId
    });

    if (!row)
        throw F2AErrors.Invalid2FACode();

    if (new Date(row.expires_at).getTime() < Date.now()) {
        await db.run(fastify.sql.f2a.deleteEmailToken, { ":user_id": userId });
        throw F2AErrors.Expired2FACode();
    }

    const match = await fastify.verifyPassword(row.token_hash, code);
    if (!match)
        throw F2AErrors.Invalid2FACode();

    const existing = await db.get(
        fastify.sql.f2a.findMfaMethodByType,
        { ":user_id": userId, ":type": "email" }
    );

    if (!existing) {
        await db.run(fastify.sql.f2a.insertMfaMethod, {
            ":user_id": userId,
            ":type": "email",
            ":secret": null,
            ":enabled": 1,
            ":is_primary": 0,
        });
    } else {
        await db.run(fastify.sql.f2a.updateMfaMethod, {
            ":id": existing.id,
            ":secret": null,
            ":enabled": 1,
        });
    }

    await db.run(fastify.sql.f2a.deleteEmailToken, { ":user_id": userId });

    return { enabled: true };
}
