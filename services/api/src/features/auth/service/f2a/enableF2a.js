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
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors, F2AErrors } from "../../errors.js";

const storeSecretSql = loadSql(import.meta.url, "../sql/storeF2aSecret.sql");
authenticator.options = { crypto };

export async function enableF2a(fastify, userId) {
    if (!userId)
        throw AuthErrors.MissingCredentials();
    console.log(userId);

    // TODO: encrypt with : AES-256
    const secret = authenticator.generateSecret();
    console.log(secret);

    // QR code data for google authenticator : id - name - secret
    const serviceName = fastify.config.APP_NAME || "ft_transcendence";
    const otpauth = authenticator.keyuri(userId.toString(), serviceName, secret);
    console.log(otpauth);

    // Create QR code -> Base 64 PNG
    let qr;
    try {
        qr = await qrcode.toDataURL(otpauth);
    } catch (err) {
        throw F2AErrors.CodeGenerationFailed();
    }
    console.log("We are here !", qr);

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
