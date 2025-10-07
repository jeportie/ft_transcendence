// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resetPwd.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/07 15:31:12 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 16:17:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";
import { hashPassword } from "../utils/password.js"

const PATH = import.meta.url;
const findResetTokenSql = loadSql(PATH, "../sql/findPwdResetToken.sql");
const markResetUsedSql = loadSql(PATH, "../sql/markPwdResetTokenUsed.sql");
const resetPwdSql = loadSql(PATH, "../sql/updatePassword.sql");

export async function resetPwd(fastify, request, reply) {
    const token = request.body.token;
    const rawPwd = request.body.pwd;

    if (!rawPwd)
        throw AuthErrors.MissingFields();
    if (!token)
        throw AuthErrors.MissingResetPwdToken();

    const db = await fastify.getDb();
    const row = await db.get(findResetTokenSql, { ":token": token });

    console.log("[DB]: ", row || null);

    if (!row)
        throw AuthErrors.InvalidResetPwdToken();
    if (row.used_at)
        throw AuthErrors.UsedResetPwdToken();

    if (new Date(row.expires_at) < new Date())
        throw AuthErrors.LinkExpired();

    const password_hash = await hashPassword(rawPwd);
    try {
        await db.run(resetPwdSql, {
            ":password_hash": password_hash,
            ":user_id": row.user_id,
        });
        await db.run(markResetUsedSql, { ":id": row.id });
    } catch (err) {
        console.log("[!DB!]:", err);
        throw AuthErrors.DbFail();
    }
    return { message: "Password has been changed." };
}
