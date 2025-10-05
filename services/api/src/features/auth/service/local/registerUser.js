// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:47:42 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 21:54:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashPassword } from "../utils/password.js";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";
import { RecaptchaErrors } from "../../errors.js";
import { issueSession } from "../utils/issueSession.js";
import { verifyRecaptcha } from "../utils/verifyRecaptcha.js";
import { sendActivationEmail } from "../utils/mailer.js";
import { randomBytes } from "crypto";
import { addDaysUTC } from "../utils/tokens.js";

const PATH = import.meta.url;
const findUserSql = loadSql(PATH, "../sql/findUserByUsernameOrEmail.sql");
const createUserSql = loadSql(PATH, "../sql/createUser.sql");
const insertActivationSql = loadSql(PATH, "../sql/insertActivationToken.sql");

export async function registerUser(fastify, request, reply) {
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

    const hashed = await hashPassword(pwd);
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

    console.log("[!!!]:", activationToken, expiresAt);

    const res = await db.run(insertActivationSql, {
        ":user_id": row.id,
        ":token": activationToken,
        ":expires_at": expiresAt,
    });

    console.log("[!!!DB]:", res);

    // Construct activation link (frontend or API)
    const activationLink = `${fastify.config.FRONTEND_URL}/api/auth/activate/${activationToken}`;

    await sendActivationEmail(/*email*/"jeromep.dev@gmail.com", activationLink);

    return issueSession(fastify, request, reply, row);

    // Optionally don’t issue session yet:
    // return {
    //     message: "User created. Please check your email to activate your account.",
    // };
};
