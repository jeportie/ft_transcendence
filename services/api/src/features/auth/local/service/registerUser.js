// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:47:42 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 22:28:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";
import { RecaptchaErrors } from "../../errors.js";
import { randomBytes } from "crypto";
import { verifyRecaptcha } from "../../utils/verifyRecaptcha.js";
import { sendActivationEmail } from "../../utils/mailer.js";
import { addDaysUTC } from "../../utils/tokens.js";

export async function registerUser(fastify, request, reply) {
    const findUserSql = fastify.sql.local.findUserByUsernameOrEmail;
    const createUserSql = fastify.sql.local.createUser;
    const insertActivationSql = fastify.sql.local.insertActivationToken;

    const username = request.body?.username;
    const email = request.body?.email;
    const pwd = request.body?.pwd;
    const captchaToken = request.body?.captcha;

    if (!username || !email || !pwd)
        throw AuthErrors.MissingFields();
    if (!captchaToken)
        throw RecaptchaErrors.MissingToken();

    const validCaptcha = await verifyRecaptcha(captchaToken, request.ip);
    if (!validCaptcha)
        throw RecaptchaErrors.InvalidRecaptcha();

    const db = await fastify.getDb();
    const exists = await db.get(findUserSql, {
        ":username": username,
        ":email": email
    });
    if (exists)
        throw AuthErrors.UserAlreadyExists(username);

    const hashed = await fastify.hashPassword(pwd);
    await db.run(createUserSql, {
        ":username": username,
        ":email": email,
        ":password_hash": hashed,
        ":role": "player"
    });

    const row = await db.get(findUserSql, {
        ":username": username,
        ":email": email
    });

    const activationToken = randomBytes(32).toString("hex");
    const expiresAt = addDaysUTC(1); // 24h validity

    await db.run(insertActivationSql, {
        ":user_id": row.id,
        ":token": activationToken,
        ":expires_at": expiresAt,
    });

    // Construct activation link (frontend or API)
    const activationLink = `http://${fastify.config.FRONTEND_URL}/activate?token=${activationToken}`;
    await sendActivationEmail(/*email*/"jeromep.dev@gmail.com", activationLink);

    return {
        activation_required: true,
        user_id: row.id,
        username: row.username,
    };
};
