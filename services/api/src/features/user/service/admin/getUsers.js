// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getUsers.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:39:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 11:05:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AdminErrors } from "../../errors.js";

export async function getUsers(fastify) {
    const db = await fastify.getDb();
    const getUsersSql = fastify.loadSql(import.meta.url, "../sql/getUsers.sql");

    const rows = await db.all(getUsersSql);
    if (!rows || rows.length === 0)
        throw AdminErrors.NoUsers();
    return { users: rows };
}
