// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginTotp.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 13:32:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { AuthErrors, F2AErrors } from "../../errors.js";
import { issueSession } from "../../utils/issueSession.js";

const PATH = import.meta.url;

export async function loginTotp(fastify, request, reply) {
    const getSecretSql = fastify.loadSql(PATH, "../sql/getF2aSecret.sql");
    const findUserByIdSql = fastify.loadSql(PATH, "../sql/findUserById.sql");

    const { code, userId } = request.body || {};

    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();
    const row = await db.get(getSecretSql, { ":user_id": userId });
    if (!row || !row.f2a_secret)
        throw AuthErrors.UserNotFound(userId);

    const valid = authenticator.check(code, row.f2a_secret);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    const userRow = await db.get(findUserByIdSql, { ":id": userId });

    return issueSession(fastify, request, reply, userRow);
}
