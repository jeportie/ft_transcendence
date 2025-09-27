// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:39:01 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 16:56:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken, addDaysUTC } from "../tokens.js";
import { setRefreshCookie } from "../cookie.js";
import { loadSql } from "../../../../utils/sqlLoader.js";

const PATH = import.meta.url;
const deleteRefreshTokenSql = loadSql(PATH, "../sql/deleteRefreshTokenByID.sql");
const findRefreshTokenSql = loadSql(PATH, "../sql/findRefreshTokenWithUserByHash.sql");
const refreshTokenSql = loadSql(PATH, "../sql/insertRefreshToken.sql");

export async function refreshToken(fastify, request, reply) {
    const name = fastify.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (!rawSigned)
        throw new Error("NO_REFRESH_COOKIE");

    const { valid, value: raw } = request.unsignCookie(rawSigned);
    if (!valid || !raw)
        throw new Error("INVALID_REFRESH_COOKIE");

    const hash = hashToken(raw);
    const db = await fastify.getDb();

    const rt = await db.get(findRefreshTokenSql, { ":token_hash": hash });
    if (!rt)
        throw new Error("REFRESH_NOT_FOUND");
    if (rt.revoked_at)
        throw new Error("REFRESH_REVOKED");
    if (new Date(rt.expires_at) < new Date())
        throw new Error("REFRESH_EXPIRED");

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


