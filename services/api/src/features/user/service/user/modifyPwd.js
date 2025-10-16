// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   modifyPwd.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/07 22:26:29 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 10:51:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { UserErrors } from "../../errors.js";

const PATH = import.meta.url;
const getMeSql = loadSql(PATH, "../sql/getMe.sql");
const updatePwdSql = loadSql(PATH, "../../../auth/service/sql/updatePassword.sql");

export async function modifyPwd(fastify, request, reply) {
    const id = request.user.sub;
    const isOauth = request.body.oauth;
    const oldPwd = request.body.oldPwd;
    const newPwd = request.body.newPwd;

    const db = await fastify.getDb();
    const row = await db.get(getMeSql, { ":id": id });
    if (!row)
        throw UserErrors.UserNotFound(id);

    if (!isOauth) {
        const ok = await fastify.verifyPassword(row.password_hash, oldPwd);
        if (!ok)
            throw UserErrors.InvalidPassword(user);
    }

    const password_hash = await fastify.hashPassword(newPwd);
    try {
        await db.run(updatePwdSql, {
            ":password_hash": password_hash,
            ":user_id": id,
        });
    } catch (err) {
        console.log("[!DB!]:", err);
        throw UserErrors.DbFail();
    }
    return { message: "Password has been changed." };
}
