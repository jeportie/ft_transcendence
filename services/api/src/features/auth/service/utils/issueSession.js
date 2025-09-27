// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   issueSession.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 20:43:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 21:02:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken, addDaysUTC } from "./tokens.js";
import { setRefreshCookie, clearRefreshCookie } from "./cookie.js";
import { loadSql } from "../../../utils/sqlLoader.js";

const PATH = import.meta.url;
const refreshTokenSql = loadSql(PATH, "./sql/insertRefreshToken.sql");

export async function issueSession(fastify, request, reply, userRow) {

    // Access Token
    const accessToken = fastify.jwt.sign({
        sub: String(userRow.id),
        username: userRow.username,
        role: userRow.role,
    });

    // Refresh Token
    const raw = generateRefreshToken();
    const hash = hashToken(raw);
    const expiresAt = addDaysUTC(fastify.config.REFRESH_TOKEN_TTL_DAYS);

    const db = await fastify.getDb();
    await db.run(refreshTokenSql, {
        ":user_id": userRow.id,
        ":token_hash": hash,
        ":user_agent": request.headers["user-agent"] || null,
        ":ip": request.ip || null,
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

