// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getMe.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 10:47:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { UserErrors } from "../../errors.js";

const getMeSql = loadSql(import.meta.url, "./sql/getMe.sql");

export async function getMe(fastify, request, reply) {
    claims = request.user;
    const db = await fastify.getDb();
    const row = await db.get(getMeSql, { ":id": Number(claims.sub) });
    if (!row)
        throw UserErrors.UserNotFound(Number(claims.sub));

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
