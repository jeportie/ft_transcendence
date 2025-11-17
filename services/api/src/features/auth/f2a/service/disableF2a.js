// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   disableF2a.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 12:05:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:47:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

export async function disableF2a(fastify, request, reply) {
    const disableF2aSql = fastify.sql.f2a.disableF2a;
    const deleteBackupCodeSql = fastify.sql.f2a.deleteBackupCode;
    const userId = request.user.sub;

    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    await db.run(disableF2aSql, { ":user_id": userId });
    await db.run(deleteBackupCodeSql, { ":user_id": userId });
}
