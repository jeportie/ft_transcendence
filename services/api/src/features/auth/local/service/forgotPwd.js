// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   forgotPwd.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/07 11:05:54 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 15:18:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthErrors } from "../../errors.js";
import { RecaptchaErrors } from "../../errors.js";
import { randomBytes } from "crypto";
import { verifyRecaptcha } from "../../utils/verifyRecaptcha.js";
import { sendResetPwdEmail } from "../../utils/mailer.js";
import { addHoursUTC } from "../../utils/tokens.js";

const PATH = import.meta.url;

export async function forgotPwd(fastify, request, reply) {
    const findUserByEmailSql = fastify.loadSql(PATH, "../sql/findUserByEmail.sql");
    const insertResetPwdSql = fastify.loadSql(PATH, "../sql/insertResetPasswordToken.sql");
    const email = request.body.email;
    const captchaToken = request.body.captcha;

    if (!email)
        throw AuthErrors.MissingFields();
    if (!captchaToken)
        throw RecaptchaErrors.MissingToken();

    const validCaptcha = verifyRecaptcha(captchaToken, request.ip);
    if (!validCaptcha)
        throw RecaptchaErrors.InvalidRecaptcha();

    const db = await fastify.getDb();
    const row = await db.get(findUserByEmailSql, { ":email": email });

    console.log("[DB]: ", row);

    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = addHoursUTC(1); // 1h validity

    try {
        await db.run(insertResetPwdSql, {
            ":user_id": row.id,
            ":token_hash": resetToken,
            ":expires_at": expiresAt,
        });
    } catch (err) {
        console.log("[Err]: ", err);
    }

    console.log("[DB]: db insert ok!");

    const resetPwdLink = `http://${fastify.config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendResetPwdEmail(/*email*/"jeromep.dev@gmail.com", resetPwdLink);

    return {
        message: "If the email exists, we will send a link. Please check your emails.",
    };
}
