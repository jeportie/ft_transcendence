// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.service.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:39:30 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 15:44:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../utils/sqlLoader.js";

const getUsersSql = loadSql(import.meta.url, "./sql/getUsers.sql");

export async function getUsers(fastify) {
    const db = await fastify.getDb();
    const rows = await db.all(getUsersSql);
    return {
        success: true,
        users: rows
    };
}
