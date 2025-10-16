// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableF2a.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 21:59:50 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 23:59:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import crypto from "crypto";
import qrcode from "qrcode";
import { AuthErrors, F2AErrors } from "../../errors.js";

authenticator.options = { crypto };

export async function enableF2a(fastify, request, reply) {
    const storeSecretSql = fastify.loadSql(import.meta.url, "../sql/storeF2aSecret.sql");
    const userId = request.user.sub;

    if (!userId)
        throw AuthErrors.MissingCredentials();

    const secret = authenticator.generateSecret();
    const serviceName = fastify.config.APP_NAME || "ft_transcendence";
    const otpauth = authenticator.keyuri(userId.toString(), serviceName, secret);

    let qr;
    try {
        qr = await qrcode.toDataURL(otpauth);
    } catch (err) {
        throw F2AErrors.CodeGenerationFailed();
    }

    const db = await fastify.getDb();
    await db.run(storeSecretSql, {
        ":user_id": userId,
        ":secret": secret,
    });

    return {
        otpauth,
        qr,
        secret,
    }
}
