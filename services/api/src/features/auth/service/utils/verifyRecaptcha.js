// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyRecaptcha.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 15:26:17 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 15:26:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fetch from "node-fetch";

/**
 * Verifies a Google reCAPTCHA token using the secret key.
 * @param {string} token - The token sent by the frontend.
 * @param {string} remoteIp - (Optional) The user's IP for stronger validation.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
export async function verifyRecaptcha(token, remoteIp) {
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
        console.warn("[reCAPTCHA] Missing RECAPTCHA_SECRET in environment");
        return false;
    }

    try {
        const params = new URLSearchParams({
            secret,
            response: token,
        });
        if (remoteIp) params.append("remoteip", remoteIp);

        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        const data = await res.json();
        console.log("[reCAPTCHA] Verification result:", data);

        return data.success === true;
    } catch (err) {
        console.error("[reCAPTCHA] Verification failed:", err);
        return false;
    }
}
