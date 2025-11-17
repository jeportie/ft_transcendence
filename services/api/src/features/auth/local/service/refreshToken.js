// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:39:01 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 18:36:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken } from "../../utils/tokens.js";
import { setRefreshCookie } from "../../utils/cookie.js";
import { AuthErrors } from "../../errors.js";

export async function refreshToken(fastify, request, reply) {
    const deleteByDeviceSql = fastify.sql.local.deleteRefreshTokenByDevice;
    const deleteRefreshTokenSql = fastify.sql.local.deleteRefreshTokenByID;
    const findRefreshTokenSql = fastify.sql.local.findRefreshTokenWithUserByHash;
    const refreshTokenSql = fastify.sql.local.insertRefreshToken;

    const name = fastify.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (!rawSigned)
        throw AuthErrors.NoRefreshCookie();

    const { valid, value: raw } = request.unsignCookie(rawSigned);
    if (!valid || !raw)
        throw AuthErrors.InvalidRefreshCookie();

    const hash = hashToken(raw);
    const db = await fastify.getDb();

    const rt = await db.get(findRefreshTokenSql, { ":token_hash": hash });
    if (!rt)
        throw AuthErrors.RefreshNotFound();
    if (rt.revoked_at)
        throw AuthErrors.RefreshRevoked();
    if (new Date(rt.expires_at) < new Date())
        throw AuthErrors.RefreshExpired();

    // Rotate
    await db.run(deleteRefreshTokenSql, { ":id": rt.id });

    const rawNew = generateRefreshToken();
    const hashNew = hashToken(rawNew);
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

    if (deviceId) {
        await db.run(deleteByDeviceSql, {
            ":user_id": rt.user_id,
            ":device_fingerprint": deviceId,
        });
    }

    await db.run(refreshTokenSql, {
        ":user_id": rt.user_id,
        ":token_hash": hashNew,
        ":user_agent": request.headers["user-agent"] || null,
        ":ip": clientIp,
        ":device_fingerprint": deviceId,
        ":expires_at": expiresAt,
    });

    setRefreshCookie(fastify, reply, rawNew, fastify.config.REFRESH_TOKEN_TTL_DAYS);

    const accessToken = fastify.jwt.sign({
        sub: String(rt.user_id),
        username: rt.username,
        role: rt.role,
    });

    return {
        token: accessToken,
        exp: fastify.config.ACCESS_TOKEN_TTL
    };
}


