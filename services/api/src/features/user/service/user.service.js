// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.service.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/02 21:34:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../utils/sqlLoader.js";
import { UserErrors } from "../errors.js";

const getMeSql = loadSql(import.meta.url, "./sql/getMe.sql");

export async function getMe(fastify, claims) {
    const db = await fastify.getDb();
    const me = await db.get(getMeSql, { ":id": Number(claims.sub) });
    if (!me)
        throw UserErrors.UserNotFound(Number(claims.sub));
    console.log("is enabled: ", Boolean(me.f2a_enabled));
    return { me };
}
