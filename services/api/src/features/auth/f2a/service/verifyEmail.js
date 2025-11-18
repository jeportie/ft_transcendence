// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyEmail.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/18 11:58:24 by jeportie          #+#    #+#             //
//   Updated: 2025/11/18 12:03:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors, F2AErrors } from "../../errors.js";

export async function verifyEmail(fastify, request, reply) {
    const userId = request.user?.sub;
    const { code } = request.body || {};

    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const findSql = fastify.sql.f2a.findEmailToken;
    const deleteSql = fastify.sql.f2a.deleteEmailToken;

    const db = await fastify.getDb();
    const row = await db.get(findSql, { ":user_id": userId });

    if (!row)
        throw F2AErrors.Invalid2FACode();

    // Check expiry
    if (new Date(row.expires_at).getTime() < Date.now()) {
        await db.run(deleteSql, { ":user_id": userId });
        throw F2AErrors.Expired2FACode();
    }

    // Validate hash
    const match = await fastify.verifyPassword(row.token_hash, code);
    if (!match)
        throw F2AErrors.Invalid2FACode();

    // Enable email 2FA
    await db.run(
        "UPDATE users SET f2a_email_enabled = 1 WHERE id = :id",
        { ":id": userId }
    );

    // Token is single-use
    await db.run(deleteSql, { ":user_id": userId });

    return { enabled: true };
}

