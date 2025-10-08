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

import { loadSql } from "../../../../utils/sqlLoader.js";
import { AdminErrors } from "../../errors.js";

const getUsersSql = loadSql(import.meta.url, "../sql/getUsers.sql");

export async function getUsers(fastify) {
    const db = await fastify.getDb();
    const rows = await db.all(getUsersSql);
    if (!rows || rows.length === 0)
        throw AdminErrors.NoUsers();
    return { users: rows };
}
