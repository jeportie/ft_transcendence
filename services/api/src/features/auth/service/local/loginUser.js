// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginUser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:51 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 16:17:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "../password.js";
import { generateRefreshToken, hashToken, addDaysUTC } from "../tokens.js";
import { setRefreshCookie, clearRefreshCookie } from "../cookie.js";
import { loadSql } from "../../../../utils/sqlLoader.js";

const PATH = import.meta.url;
const userSql = loadSql(PATH, "../sql/findUserByUsernameOrEmail.sql");
const refreshTokenSql = loadSql(PATH, "../sql/insertRefreshToken.sql");

export async function loginUser(fastify, request, reply, opts = {}) {
    const skipPwd = Boolean(opts.skipPwd);
    const user = request.body?.user;
    const pwd = request.body?.pwd;

    if (!user || (!skipPwd && !pwd))
        return (reply.code(400).send({
            success: false,
            error: "Missing credentials",
        }));

    const db = await fastify.getDb();
    const row = await db.get(userSql, {
        ":username": user,
        ":email": user
    });

    if (!row) {
        fastify.log.warn(`[Auth] Failed login attempt for user/email: ${user}`);
        return (reply.code(401).send({
            success: false,
            message: "Invalid credentials"
        }));
    }

    if (!skipPwd) {
        const ok = await verifyPassword(row.password_hash, pwd);
        if (!ok) {
            fastify.log.warn(`[Auth] Invalid password for user/email: ${user}`);
            return (reply.code(401).send({
                success: false,
                message: "Invalid credentials"
            }));
        }
    }

    // Access Token
    const accessToken = fastify.jwt.sign({
        sub: String(row.id),
        username: row.username,
        role: row.role,
    });

    // Refresh Token
    const raw = generateRefreshToken();
    const hash = hashToken(raw);
    const expiresAt = addDaysUTC(fastify.config.REFRESH_TOKEN_TTL_DAYS);

    await db.run(refreshTokenSql, {
        ":user_id": row.id,
        ":token_hash": hash,
        ":user_agent": request.headers["user-agent"] || null,
        ":ip": request.ip || null,
        ":expires_at": expiresAt,
    });

    clearRefreshCookie(fastify, reply);
    setRefreshCookie(fastify, reply, raw, fastify.config.REFRESH_TOKEN_TTL_DAYS);

    return ({
        success: true,
        user: row.username,
        role: row.role,
        token: accessToken,
        exp: fastify.config.ACCESS_TOKEN_TTL,
    });
};

