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
    if (!rawSigned) return reply.code(401).send({ success: false });

    const { valid, value: raw } = request.unsignCookie(rawSigned);
    if (!valid || !raw) return reply.code(401).send({ success: false });

    const hash = hashToken(raw);
    const db = await fastify.getDb();

    const rt = await db.get(findRefreshTokenSql, { ":token_hash": hash });
    if (!rt || rt.revoked_at || new Date(rt.expires_at) < new Date()) {
        return reply.code(401).send({ success: false });
    }

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

    // New access token
    const accessToken = fastify.jwt.sign({
        sub: String(rt.user_id),
        username: rt.username,
        role: rt.role,
    });

    return {
        success: true,
        token: accessToken,
        exp: fastify.config.ACCESS_TOKEN_TTL
    };
}


