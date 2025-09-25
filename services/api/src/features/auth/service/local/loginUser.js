// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginUser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:51 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:39:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "../password.js";
import { generateRefreshToken, hashToken, addDaysUTC } from "../tokens.js";
import { setRefreshCookie, clearRefreshCookie } from "../cookie.js";

export async function loginUser(fastify, request, reply, opts = {}) {
    const skipPwd = Boolean(opts.skipPwd);
    const user = req.body?.user;
    const pwd = req.body?.pwd;

    if (!user || (!skipPwd && !pwd))
        return (reply.code(400).send({
            success: false,
            error: "Missing credentials",
        }));

    const db = await fastify.getDb();
    const row = await db.get(
        `SELECT id, username, email, password_hash, role
             FROM    users
             WHERE   username    = ? 
             OR      email       = ?
             LIMIT 1`,
        user, user
    );

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

    await db.run(
        `INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            user_agent,
            ip,
            expires_at)
        VALUES (?, ?, ?, ?, ?)`,
        row.id,
        hash,
        request.headers["user-agent"] || null,
        request.ip || null,
        expiresAt,
    );

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

