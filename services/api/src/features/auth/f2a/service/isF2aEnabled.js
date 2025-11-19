// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   isF2aEnabled.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/03 22:02:29 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:29:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";

export async function checkF2a(fastify, request, reply) {
    const user = request.body?.user;
    if (!user)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();

    const getUser = fastify.sql.local.findUserByUsernameOrEmail;
    const row = await db.get(getUser, { ":username": user, ":email": user });

    if (!row)
        throw AuthErrors.UserNotFound(user);

    const mfa = await db.all(
        fastify.sql.f2a.findMfaMethods,
        { ":user_id": row.id }
    );

    const enabled = mfa.some(method => method.enabled === 1);

    return { f2a_enabled: enabled };
}
