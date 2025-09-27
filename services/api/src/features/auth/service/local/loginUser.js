// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginUser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:51 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 21:06:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "../password.js";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { issueSession } from "../issueSession.js";
import { AuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const userSql = loadSql(PATH, "../sql/findUserByUsernameOrEmail.sql");

export async function loginUser(fastify, request, reply, opts = {}) {
    const skipPwd = Boolean(opts.skipPwd);
    const user = request.body?.user;
    const pwd = request.body?.pwd;

    if (!user || (!skipPwd && !pwd))
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(userSql, {
        ":username": user,
        ":email": user
    });

    if (!row)
        throw AuthErrors.UserNotFound(user);

    if (!skipPwd) {
        const ok = await verifyPassword(row.password_hash, pwd);
        if (!ok)
            throw AuthErrors.InvalidPassword(user);
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
    return issueSession(fastify, request, reply, row);
}
