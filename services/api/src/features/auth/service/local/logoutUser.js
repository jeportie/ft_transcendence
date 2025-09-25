// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logoutUser.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:10 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:37:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashToken } from "../tokens.js";
import { clearRefreshCookie } from "../cookie.js";

export async function logoutUser(fastify, request, reply) {
    const name = fastify.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (rawSigned) {
        const { valid, value: raw } = request.unsignCookie(rawSigned);
        if (valid && raw) {
            const hash = hashToken(raw);
            const db = await fastify.getDb();
            await db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, hash);
        }
    }
    clearRefreshCookie(fastify, reply);
    return { success: true };
}
