// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getSession.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:39:04 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 15:15:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

export async function getSession(fastify, request, reply) {
    const userId = request.user?.sub;
    const getSessionSql = fastify.sql.sessions.getSession;

    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const rows = await db.all(getSessionSql, { ":user_id": userId });

    const res = rows.map((s) => ({
        id: s.id,
        device: parseDevice(s.user_agent),
        browser: parseBrowser(s.user_agent),
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

/** --- Browser name --- */
function parseBrowser(ua = "") {
    if (!ua) return "Unknown";
    ua = ua.toLowerCase();

    if (ua.includes("edg/")) return "Microsoft Edge";
    if (ua.includes("chrome/")) return "Google Chrome";
    if (ua.includes("firefox/")) return "Mozilla Firefox";
    if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
    if (ua.includes("opera") || ua.includes("opr/")) return "Opera";
    if (ua.includes("vivaldi")) return "Vivaldi";
    if (ua.includes("brave")) return "Brave";
    return "Unknown";
}
