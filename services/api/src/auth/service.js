// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   service.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/08 18:25:18 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:56:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "./password.js";
import { generateRefreshToken, hashToken, addDaysUTC } from "./tokens.js";
import { setRefreshCookie, clearRefreshCookie } from "./cookie.js";

export async function loginUser(app, user, pwd, request, reply) {
    if (!user || !pwd)
        return (reply.code(400).send({
            success: false,
            error: "Missing credentials",
        }));

    const db = await app.getDb();
    const row = await db.get(
        `SELECT id, username, email, password_hash, role
             FROM    users
             WHERE   username    = ? 
             OR      email       = ?
             LIMIT 1`,
        user, user
    );

    if (!row) {
        app.log.warn(`[Auth] Failed login attempt for user/email: ${user}`);
        return (reply.code(401).send({
            success: false,
            message: "Invalid credentials"
        }));
    }

    const ok = await verifyPassword(row.password_hash, pwd);
    if (!ok) {
        app.log.warn(`[Auth] Invalid password for user/email: ${user}`);
        return (reply.code(401).send({
            success: false,
            message: "Invalid credentials"
        }));
    }

    // Access Token
    const accessToken = app.jwt.sign({
        sub: String(row.id),
        username: row.username,
        role: row.role,
    });

    // Refresh Token
    const raw = generateRefreshToken();
    const hash = hashToken(raw);
    const expiresAt = addDaysUTC(app.config.REFRESH_TOKEN_TTL_DAYS);

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

    clearRefreshCookie(app, reply);
    setRefreshCookie(app, reply, raw, app.config.REFRESH_TOKEN_TTL_DAYS);

    return ({
        success: true,
        user: row.username,
        role: row.role,
        token: accessToken,
        exp: app.config.ACCESS_TOKEN_TTL,
    });
};

export async function refreshToken(app, request, reply) {
    const name = app.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (!rawSigned) return reply.code(401).send({ success: false });

    const { valid, value: raw } = request.unsignCookie(rawSigned);
    if (!valid || !raw) return reply.code(401).send({ success: false });

    const hash = hashToken(raw);
    const db = await app.getDb();

    // const rows = await db.all("SELECT token_hash FROM refresh_tokens");
    // console.log("DB tokens:", rows);

    const rt = await db.get(
        `SELECT rt.*, u.username, u.role
        FROM refresh_tokens rt
        JOIN users u ON u.id = rt.user_id
        WHERE rt.token_hash = ?`,
        hash
    );
    if (!rt || rt.revoked_at || new Date(rt.expires_at) < new Date()) {
        return reply.code(401).send({ success: false });
    }

    // Rotate
    await db.run(`DELETE FROM refresh_tokens WHERE id = ?`, rt.id);

    const rawNew = generateRefreshToken();
    const hashNew = hashToken(rawNew);
    const expiresAt = addDaysUTC(app.config.REFRESH_TOKEN_TTL_DAYS);

    await db.run(
        `INSERT INTO refresh_tokens (user_id, token_hash, user_agent, ip, expires_at, last_used_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        rt.user_id,
        hashNew,
        request.headers["user-agent"] || null,
        request.ip || null,
        expiresAt
    );

    setRefreshCookie(app, reply, rawNew, app.config.REFRESH_TOKEN_TTL_DAYS);

    // New access token
    const accessToken = app.jwt.sign({
        sub: String(rt.user_id),
        username: rt.username,
        role: rt.role,
    });

    return {
        success: true,
        token: accessToken,
        exp: app.config.ACCESS_TOKEN_TTL
    };
}

export async function logoutUser(app, request, reply) {
    const name = app.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (rawSigned) {
        const { valid, value: raw } = request.unsignCookie(rawSigned);
        if (valid && raw) {
            const hash = hashToken(raw);
            const db = await app.getDb();
            await db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, hash);
        }
    }
    clearRefreshCookie(app, reply);
    return { success: true };
}
