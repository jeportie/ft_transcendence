// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginUser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 12:33:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { issueSession } from "../../utils/issueSession.js";
import { AuthErrors } from "../../errors.js";

/**
 * Return true if the user has any enabled MFA method (totp, email, sms…)
 */
async function userRequiresMfa(db, fastify, userId) {
    const mfaRows = await db.all(
        fastify.sql.f2a.findMfaMethods,
        { ":user_id": userId }
    );

    return mfaRows.some(m => m.enabled === 1);
}

/**
 * LOGIN WITH PASSWORD
 */
export async function loginUser(fastify, request, reply) {
    const user = request.body?.user;
    const pwd = request.body?.pwd;

    if (!user || !pwd)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const userSql = fastify.sql.local.findUserByUsernameOrEmail;

    const row = await db.get(userSql, {
        ":username": user,
        ":email": user
    });

    if (!row)
        throw AuthErrors.UserNotFound(user);

    // Check password
    const ok = await fastify.verifyPassword(row.password_hash, pwd);
    if (!ok)
        throw AuthErrors.InvalidPassword(user);

    // Check activation
    if (!row.is_active) {
        return {
            activation_required: true,
            user_id: row.id,
            username: row.username,
        };
    }

    // Check MFA (new logic)
    const needsMfa = await userRequiresMfa(db, fastify, row.id);
    if (needsMfa) {
        return {
            f2a_required: true,
            user_id: row.id,
            username: row.username,
        };
    }

    return issueSession(fastify, request, reply, row);
}

/**
 * LOGIN WITHOUT PASSWORD
 * (used after OAuth, activation, backup code, magic link…)
 */
export async function loginWithoutPwd(fastify, id, request, reply) {
    if (!id)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const userSql = fastify.sql.local.findUserByUsernameOrEmail;

    const row = await db.get(userSql, {
        ":username": id,
        ":email": id
    });

    if (!row)
        throw AuthErrors.UserNotFound(id);

    // Check MFA
    const needsMfa = await userRequiresMfa(db, fastify, row.id);
    if (needsMfa) {
        return {
            f2a_required: true,
            user_id: row.id,
            username: row.username,
        };
    }

    return issueSession(fastify, request, reply, row);
}
