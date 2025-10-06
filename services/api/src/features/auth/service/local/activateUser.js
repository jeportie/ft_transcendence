// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   activateUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 19:17:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:45:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const findTokenSql = loadSql(PATH, "../sql/findActivationToken.sql");
const markUsedSql = loadSql(PATH, "../sql/markActivationTokenUsed.sql");
const activateUserSql = loadSql(PATH, "../sql/activateUser.sql");

export async function activateUser(fastify, request, reply) {
    const token = request.params.token;

    if (!token)
        throw AuthErrors.MissingActivationToken();

    const db = await fastify.getDb();
    const row = await db.get(findTokenSql, { ":token": token });
    if (!row)
        throw AuthErrors.InvalidActivationToken();
    if (row.used_at)
        throw AuthErrors.UsedActivationToken();

    if (new Date(row.expires_at) < new Date())
        throw AuthErrors.LinkExpired();

    await db.run(activateUserSql, { ":user_id": row.user_id });
    await db.run(markUsedSql, { ":id": row.id });

    return { message: "Account activated successfully" };
}
