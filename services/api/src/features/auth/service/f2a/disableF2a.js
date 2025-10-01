// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   disableF2a.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 12:05:44 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 12:20:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const disableF2aSql = loadSql(PATH, "../sql/disableF2a.sql");
const deleteBackupCodeSql = loadSql(PATH, "../sql/deleteBackupCode.sql");

export async function disableF2a(fastify, request, reply) {
    const userId = request.user.id;

    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    await db.run(disableF2aSql, { ":user_id": userId });
    await db.run(deleteBackupCodeSql, { ":user_id": userId });
}
