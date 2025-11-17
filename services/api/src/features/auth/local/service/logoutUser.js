// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logoutUser.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:10 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 14:52:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashToken } from "../..//utils/tokens.js";
import { clearRefreshCookie } from "../../utils/cookie.js";
import { AuthErrors } from "../../errors.js";

export async function logoutUser(fastify, request, reply) {
    const deleteRefreshToken = fastify.loadSql(import.meta.url, "../sql/deleteRefreshTokenByHash.sql");

    const name = fastify.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (!rawSigned)
        throw AuthErrors.NoRefreshCookie();

    const { valid, value: raw } = request.unsignCookie(rawSigned);
    if (!valid || !raw)
        throw AuthErrors.InvalidRefreshCookie();

    const hash = hashToken(raw);
    const db = await fastify.getDb();
    await db.run(deleteRefreshToken, { ":token_hash": hash });

    clearRefreshCookie(fastify, reply);
}
