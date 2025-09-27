// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.service.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 15:44:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../utils/sqlLoader.js";

const getMeSql = loadSql(import.meta.url, "./sql/getMe.sql");

export async function getMe(fastify, claims) {
    const db = await fastify.getDb();
    const me = await db.get(getMeSql, { ":id": Number(claims.sub) });
    if (!me)
        throw new Error("USER_NOT_FOUND");

    return { me };
}
