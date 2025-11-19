// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getMe.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:41:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { UserErrors } from "../../errors.js";

export async function getMe(fastify, request, reply) {
    const db = await fastify.getDb();
    const getMeSql = fastify.sql.user.getMe;
    const getMfaSql = fastify.sql.user.getMfaMethods;

    const jwt = request.user;
    const row = await db.get(getMeSql, { ":id": jwt.sub });

    if (!row)
        throw UserErrors.UserNotFound(jwt.sub);

    // detect OAuth accounts
    const oauth = row.password_hash === "<oauth>";

    // load MFA methods
    const methods = await db.all(getMfaSql, { ":user_id": row.id });

    // Normalize output
    const mfa = {
        totp: methods.some(m => m.type === "totp" && m.enabled === 1),
        email: methods.some(m => m.type === "email" && m.enabled === 1),
        sms: methods.some(m => m.type === "sms" && m.enabled === 1),
        backup: true, // you always generate, so enabled doesn't apply
    };

    const me = {
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        created_at: row.created_at,
        oauth,
        mfa,
    };

    return { me };
}
