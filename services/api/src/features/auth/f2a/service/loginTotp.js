// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginTotp.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 00:23:40 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 15:02:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { authenticator } from "otplib";
import { AuthErrors, F2AErrors } from "../../errors.js";
import { issueSession } from "../../utils/issueSession.js";

export async function loginTotp(fastify, request, reply) {
    const { code, userId } = request.body || {};
    if (!userId || !code)
        throw AuthErrors.MissingCredentials();

    const db = await fastify.getDb();

    const mfaRow = await db.get(
        fastify.sql.f2a.findMfaMethodByType,
        { ":user_id": userId, ":type": "totp" }
    );

    if (!mfaRow)
        throw F2AErrors.TotpNotEnabled();

    if (!mfaRow.secret)
        throw F2AErrors.MissingTotpSecret();

    const valid = authenticator.check(code, mfaRow.secret);
    if (!valid)
        throw F2AErrors.Invalid2FACode();

    await db.run(fastify.sql.f2a.updateMfaLastUsedAt, { ":id": mfaRow.id });

    const userRow = await db.get(
        fastify.sql.f2a.findUserById,
        { ":id": userId }
    );

    if (!userRow)
        throw AuthErrors.UserNotFound(userId);

    return issueSession(fastify, request, reply, userRow);
}
