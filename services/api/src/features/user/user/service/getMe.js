// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getMe.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 16:55:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { UserErrors } from "../../errors.js";

export async function getMe(fastify, request, reply) {
    const db = await fastify.getDb();
    const getMeSql = fastify.sql.user.getMe;

    const jwtClaim = request.user;
    const row = await db.get(getMeSql, { ":id": jwtClaim.sub });
    if (!row)
        throw UserErrors.UserNotFound(jwtClaim.sub);

    let oauth = false;
    if (row.password_hash === "<oauth>")
        oauth = true;

    const me = {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        created_at: row.created_at,
        f2a_enabled: row.f2a_enabled,
        oauth,
    };
    return { me };
}
