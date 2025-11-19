// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   disableF2a.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 12:05:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:31:10 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

export async function disableF2a(fastify, request, reply) {
    const userId = request.user?.sub;
    if (!userId)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();

    await db.run(fastify.sql.f2a.disableMfaMethod, {
        ":user_id": userId,
        ":type": "totp"
    });

    await db.run(fastify.sql.f2a.disableMfaMethod, {
        ":user_id": userId,
        ":type": "email"
    });

    // also delete backup codes
    await db.run(fastify.sql.f2a.deleteBackupCode, {
        ":user_id": userId
    });

    return { success: true };
}

