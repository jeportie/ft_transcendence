// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginUser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 11:00:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { issueSession } from "../utils/issueSession.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const userSql = loadSql(PATH, "../sql/findUserByUsernameOrEmail.sql");

export async function loginUser(fastify, request, reply) {
    const user = request.body?.user;
    const pwd = request.body?.pwd;

    if (!user || !pwd)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(userSql, {
        ":username": user,
        ":email": user
    });

    if (!row)
        throw AuthErrors.UserNotFound(user);

    const ok = await fastify.verifyPassword(row.password_hash, pwd);
    if (!ok)
        throw AuthErrors.InvalidPassword(user);

    if (row.f2a_enabled) {
        return {
            f2a_required: true,
            user_id: row.id,
            username: row.username,
        };
    }
    if (!row.is_active) {
        return {
            activation_required: true,
            user_id: row.id,
            username: row.username,
        }
    }
    return issueSession(fastify, request, reply, row);
};

export async function loginWithoutPwd(fastify, id, request, reply) {
    if (!id)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(userSql, {
        ":username": id,
        ":email": id
    });

    if (!row)
        throw AuthErrors.UserNotFound();

    if (row.f2a_enabled) {
        return {
            f2a_required: true,
            user_id: row.id,
            username: row.username,
        };
    }
    return issueSession(fastify, request, reply, row);
}
