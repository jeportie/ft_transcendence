// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   mailer.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 16:51:02 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 14:57:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Resend } from "resend";
import config from "../../../../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

/**
 * Send an activation email using Resend
 * @param {string} to - recipient email
 * @param {string} link - activation link
 */
export async function sendActivationEmail(to, link) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'jeportie <onboarding@resend.dev>',
            to,
            subject: "No-Reply - Activate your account",
            html: `
                <h2>Welcome to ft_transcendence!</h2>
                <p>Please activate your account by clicking the link below:</p>
                <p><a href="${link}">${link}</a></p>
                <p>This link will expire in 24 hours.</p>
            `,
        });

        if (error) {
            console.error("[Mailer] ❌ Resend API error:", error);
            throw error;
        }

        console.log(`[Mailer] ✅ Activation email sent to ${to}`);
        return data;
    } catch (err) {
        console.error("[Mailer] ❌ Failed to send activation email:", err);
        throw err;
    }
}

/**
 * Send a reset password email using Resend
 * @param {string} to - recipient email
 * @param {string} link - activation link
 */
export async function sendResetPwdEmail(to, link) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'jeportie <onboarding@resend.dev>',
            to,
            subject: "No-Reply - Reset Password",
            html: `
                <h2>Important !</h2>
                <p>Please reset your password by clicking the link below:</p>
                <p><a href="${link}">${link}</a></p>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        if (error) {
            console.error("[Mailer] ❌ Resend API error:", error);
            throw error;
        }

        console.log(`[Mailer] ✅ Reset Password email sent to ${to}`);
        return data;
    } catch (err) {
        console.error("[Mailer] ❌ Failed to send password reset email:", err);
        throw err;
    }
}
