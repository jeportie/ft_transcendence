// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   mailer.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 16:51:02 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 20:14:57 by jeportie         ###   ########.fr       //
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
            subject: "Not-Reply - Activate your account",
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
