// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:39:01 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:39:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { generateRefreshToken, hashToken, addDaysUTC } from "../tokens.js";

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


