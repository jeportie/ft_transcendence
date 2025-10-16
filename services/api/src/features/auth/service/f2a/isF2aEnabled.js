// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   isF2aEnabled.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/03 22:02:29 by jeportie          #+#    #+#             //
//   Updated: 2025/10/04 10:10:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;

export async function checkF2a(fastify, request, reply) {
    const user = request.body?.user;
    if (!user)
        throw AuthErrors.MissingCredentials();
    const db = await fastify.getDb();
    const checkF2aSql = fastify.loadSql(PATH, "../sql/checkF2a.sql");
    const checkF2aByMailSql = fastify.loadSql(PATH, "../sql/checkF2aByMail.sql");

    let row = await db.get(checkF2aSql, {
        ":username": user,
    })
    if (!row) {
        row = await db.get(checkF2aByMailSql, {
            ":email": user,
        })
    }
    if (!row)
        throw AuthErrors.UserNotFound(user);
    return { f2a_enabled: row.f2a_enabled };
}
