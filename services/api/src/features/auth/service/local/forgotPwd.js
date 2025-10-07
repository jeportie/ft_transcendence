// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   forgotPwd.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/07 11:05:54 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 11:14:45 by jeportie         ###   ########.fr       //
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

export async function forgotPwd(fastify, request, reply) {
    const email = request.body.email;
    const captchaToken = request.body.captcha;
}
