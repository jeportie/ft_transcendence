// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getSession.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:39:04 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 11:01:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;

export async function getSession(fastify, request, reply) {
    const db = await fastify.getDb();
    const sql = fastify.loadSql(PATH, "../sql/getSession.sql");

    console.log(request.user);

    const userId = request.user?.sub;
    if (!userId) throw AuthErrors.MissingCredentials;

    const rows = await db.all(sql, { ":user_id": userId });

    console.log(rows.map((s) => ({
        id: s.id,
        device: parseDevice(s.user_agent),
        ip: s.ip || "Unknown",
        createdAt: s.created_at,
        lastActiveAt: s.last_used_at,
        expiresAt: s.expires_at,
        revokedAt: s.revoked_at,
        current: request.refreshTokenId
            ? s.id === request.refreshTokenId
            : false,
    })));

    const res = rows.map((s) => ({
        id: s.id,
        device: parseDevice(s.user_agent),
        agent: s.user_agent,
        ip: s.ip || "Unknown",
        createdAt: s.created_at,
        lastActiveAt: s.last_used_at,
        expiresAt: s.expires_at,
        revokedAt: s.revoked_at,
        current: request.refreshTokenId
            ? s.id === request.refreshTokenId
            : false,
    }));
    return { sessions: res };
}

// --- Small util to prettify device info ------------------------------------
function parseDevice(ua = "") {
    if (!ua) return "Unknown device";
    if (/mobile/i.test(ua)) return "Mobile";
    if (/mac/i.test(ua)) return "Mac";
    if (/windows/i.test(ua)) return "Windows PC";
    if (/linux/i.test(ua)) return "Linux";
    if (/android/i.test(ua)) return "Android";
    return ua.split(" ")[0] || ua;
}

