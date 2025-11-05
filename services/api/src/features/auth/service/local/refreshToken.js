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

import { generateRefreshToken, hashToken, addDaysUTC } from "../utils/tokens.js";
import { setRefreshCookie } from "../utils/cookie.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;

export async function refreshToken(fastify, request, reply) {
    const deleteByDeviceSql = fastify.loadSql(PATH, "../sql/deleteRefreshTokenByDevice.sql");
    const deleteRefreshTokenSql = fastify.loadSql(PATH, "../sql/deleteRefreshTokenByID.sql");
    const findRefreshTokenSql = fastify.loadSql(PATH, "../sql/findRefreshTokenWithUserByHash.sql");
    const refreshTokenSql = fastify.loadSql(PATH, "../sql/insertRefreshToken.sql");
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
    const expiresAt = addDaysUTC(fastify.config.REFRESH_TOKEN_TTL_DAYS);

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


