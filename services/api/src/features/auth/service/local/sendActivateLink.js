// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sendActivateLink.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 22:19:08 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 10:01:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";
import { addDaysUTC } from "../utils/tokens.js";
import { sendActivationEmail } from "../utils/mailer.js";
import { randomBytes } from "crypto";

const PATH = import.meta.url;

export async function sendActivateLink(fastify, request, reply) {
    const insertActivationSql = fastify.loadSql(PATH, "../sql/insertActivationToken.sql");
    const findActivationTokenByUserIdSql = fastify.loadSql(PATH, "../sql/findActivationTokenByUserId.sql")

    const user_id = request.body.user_id;

    let activationToken = null;
    let activationLink = null;

    const db = await fastify.getDb();
    const row = await db.get(findActivationTokenByUserIdSql, {
        ":user_id": user_id,
    });
    if (!row || new Date(tok.expires_at) <= new Date()) {
        activationToken = randomBytes(32).toString("hex");
        const expiresAt = addDaysUTC(1); // 24h validity

        try {
            await db.run(insertActivationSql, {
                ":user_id": user_id,
                ":token": activationToken,
                ":expires_at": expiresAt,
            });
        } catch (err) {
            console.error("[InsrtActivationToken]: ", err);
            throw AuthErrors.DbFail();
        }

    } else {
        activationToken = row.token;
    }

    activationLink = `http://${fastify.config.FRONTEND_URL}/activate?token=${activationToken}`;
    await sendActivationEmail(/*email*/"jeromep.dev@gmail.com", activationLink);
}
