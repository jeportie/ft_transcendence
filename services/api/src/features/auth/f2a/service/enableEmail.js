// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableEmail.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/18 11:57:31 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:27:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";
import { AuthErrors } from "../../errors.js";
import { send2FAEmail } from "../../utils/mailer.js";

export async function enableEmail(fastify, request, reply) {
    const userId = request.user?.sub;
    const userEmail = request.body?.email;

    if (!userId)
        throw AuthErrors.MissingCredentials();
    if (!userEmail)
        throw new AppError("EMAIL_REQUIRED", "Email is required", 400);

    const db = await fastify.getDb();

    // SQL shortcuts
    const deleteTokenSql = fastify.sql.f2a.deleteEmailToken;
    const insertTokenSql = fastify.sql.f2a.insertEmailToken;
    const findEmailMfaSql = fastify.sql.f2a.findMfaMethodByType;
    const insertMfaSql = fastify.sql.f2a.insertMfaMethod;
    const updateMfaSql = fastify.sql.f2a.updateMfaMethod;

    // Generate 6-digit OTP
    const raw = crypto.randomInt(100000, 1000000).toString();
    const hash = await fastify.hashPassword(raw);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

    // 1. Remove previous email verification token
    await db.run(deleteTokenSql, { ":user_id": userId });

    // 2. Insert new email token
    await db.run(insertTokenSql, {
        ":user_id": userId,
        ":token_hash": hash,
        ":expires_at": expiresAt
    });

    // 3. Ensure mfa_methods has a row for email
    const existing = await db.get(findEmailMfaSql, {
        ":user_id": userId,
        ":type": "email"
    });

    if (!existing) {
        await db.run(insertMfaSql, {
            ":user_id": userId,
            ":type": "email",
            ":secret": null,
            ":enabled": 0,     // will be set to 1 in verifyEmail
            ":is_primary": 0,
        });
    } else {
        // Update metadata only
        await db.run(updateMfaSql, {
            ":id": existing.id,
            ":secret": null,
            ":enabled": 0
        });
    }

    // 4. Send email code
    // await send2FAEmail(userEmail, raw); // to be used in prod
    await send2FAEmail("jeromep.dev@gmail.com", raw);

    return { sent: true };
}
