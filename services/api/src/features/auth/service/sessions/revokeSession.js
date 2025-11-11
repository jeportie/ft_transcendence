// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   revokeSession.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:39:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 15:18:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;

export async function revokeSession(fastify, request, reply) {
    const db = await fastify.getDb();
    const revokeSessionSql = fastify.loadSql(PATH, "../sql/revokeSession.sql");

    const sessionId = request.body?.sessionId ?? request.params?.id;
    const userId = request.user?.sub;

    if (!userId) throw AuthErrors.UserNotFound();
    if (!sessionId) throw AuthErrors.NoRefreshCookie;

    const res = await db.run(revokeSessionSql, {
        ":id": sessionId,
        ":user_id": userId,
    });

    const changed = res?.changes > 0;

    if (!changed) {
        return {
            success: false,
            message: "Session not found or already revoked.",
            revokedId: String(sessionId),
        };
    }

    try {
        if (String(request.refreshTokenId ?? "") === String(sessionId)) {
            // If you have a utility: fastify.clearAuthCookies?.(reply);
            // Otherwise directly clear your cookies (names may differ in your project):
            reply.clearCookie?.("refreshToken", { path: "/" });
            reply.clearCookie?.("accessToken", { path: "/" });
        }
    } catch (_) { /* no-op; cookie helpers may not exist here */ }

    return {
        success: true,
        revokedId: String(sessionId),
        currentRevoked: String(request.refreshTokenId ?? "") === String(sessionId),
    };
}
