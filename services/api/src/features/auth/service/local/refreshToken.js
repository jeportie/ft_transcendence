// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:39:01 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 14:55:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken, addDaysUTC } from "../utils/tokens.js";
import { setRefreshCookie } from "../utils/cookie.js";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const deleteRefreshTokenSql = loadSql(PATH, "../sql/deleteRefreshTokenByID.sql");
const findRefreshTokenSql = loadSql(PATH, "../sql/findRefreshTokenWithUserByHash.sql");
const refreshTokenSql = loadSql(PATH, "../sql/insertRefreshToken.sql");

export async function refreshToken(fastify, request, reply) {
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

    await db.run(refreshTokenSql, {
        ":user_id": rt.user_id,
        ":token_hash": hashNew,
        ":user_agent": request.headers["user-agent"] || null,
        ":ip": request.ip || null,
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


