// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableF2a.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 21:59:50 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:20:04 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import crypto from "crypto";
import qrcode from "qrcode";
import { AuthErrors } from "../../errors.js";

authenticator.options = { crypto };

export async function enableF2a(fastify, request, reply) {
    const userId = request.user?.sub;
    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();

    const existing = await db.get(
        fastify.sql.f2a.findMfaMethodByType,
        { ":user_id": userId, ":type": "totp" }
    );

    const secret = authenticator.generateSecret();
    const serviceName = fastify.config.APP_NAME || "ft_transcendence";
    const otpauth = authenticator.keyuri(String(userId), serviceName, secret);
    const qr = await qrcode.toDataURL(otpauth);

    if (!existing) {
        await db.run(fastify.sql.f2a.insertMfaMethod, {
            ":user_id": userId,
            ":type": "totp",
            ":secret": secret,
            ":enabled": 0,
            ":is_primary": 1,
        });
    } else {
        await db.run(fastify.sql.f2a.updateMfaMethod, {
            ":id": existing.id,
            ":secret": secret,
            ":enabled": 0,
        });
    }

    return { otpauth, qr, secret };
}
