// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   issueSession.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 20:43:46 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 15:12:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken, addDaysUTC } from "./tokens.js";
import { setRefreshCookie, clearRefreshCookie } from "./cookie.js";

export async function issueSession(fastify, request, reply, userRow) {
    const refreshTokenSql = fastify.sql.local.insertRefreshToken;

    if (!userRow) {
        fastify.log.error("[issueSession] userRow is null/undefined");
        throw new Error("issueSession: userRow missing");
    }

    // Access Token
    const accessToken = fastify.jwt.sign({
        sub: String(userRow.id),
        username: userRow.username,
        role: userRow.role,
    });

    // Refresh Token
    const raw = generateRefreshToken();
    const hash = hashToken(raw);
    const expiresAt = new Date(Date.now() + fastify.config.REFRESH_TOKEN_TTL_DAYS * 24 * 3600 * 1000)
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .slice(0, 19); // -> "YYYY-MM-DD HH:MM:SS"


    const clientIp =
        request.headers['x-client-ip'] ||
        request.headers['x-forwarded-for']?.split(',')[0].trim() ||
        request.ip;

    const deviceId = request.headers["x-device-id"] || null;

    console.log(clientIp, deviceId);

    const db = await fastify.getDb();
    await db.run(refreshTokenSql, {
        ":user_id": userRow.id,
        ":token_hash": hash,
        ":user_agent": request.headers["user-agent"] || null,
        ":ip": clientIp,
        ":device_fingerprint": deviceId,
        ":expires_at": expiresAt,
    });


    clearRefreshCookie(fastify, reply);
    setRefreshCookie(fastify, reply, raw, fastify.config.REFRESH_TOKEN_TTL_DAYS);

    return ({
        user: userRow.username,
        role: userRow.role,
        token: accessToken,
        exp: fastify.config.ACCESS_TOKEN_TTL,
    });
};

