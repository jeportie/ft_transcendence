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

const DOMAIN = import.meta.url;
const disableF2aSql = loadSql(DOMAIN, "../sql/disableF2a.sql");
const deleteBackupCodeSql = loadSql(DOMAIN, "../sql/deleteBackupCode.sql");

export async function disableF2a(fastify, userId) {
    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    await db.run(disableF2aSql, { ":user_id": userId });
    await db.run(deleteBackupCodeSql, { ":user_id": userId });
}
