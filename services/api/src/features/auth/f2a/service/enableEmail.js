// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableEmail.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/18 11:57:31 by jeportie          #+#    #+#             //
//   Updated: 2025/11/18 12:06:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";
import { AuthErrors } from "../../errors.js";
import { send2FAEmail } from "../../utils/mailer.js";

export async function enableEmail(fastify, request, reply) {
    const userId = request.user?.sub;

    if (!userId)
        throw AuthErrors.MissingCredentials();

    const deleteSql = fastify.sql.f2a.deleteEmailToken;
    const insertSql = fastify.sql.f2a.insertEmailToken;

    // Generate 6-digit code
    const raw = crypto.randomInt(100000, 1000000).toString();
    const hash = await fastify.hashPassword(raw);

    // Token expiry = 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .slice(0, 19);


    const db = await fastify.getDb();

    // Remove old token if exists
    await db.run(deleteSql, { ":user_id": userId });

    // Insert new token
    await db.run(insertSql, {
        ":user_id": userId,
        ":token_hash": hash,
        ":expires_at": expiresAt
    });

    // Send email
    const userEmail = request.body.email;
    console.log(userEmail);
    await send2FAEmail(/*userEmail*/"jeromep.dev@gmail.com", raw);

    return { sent: true };
}
