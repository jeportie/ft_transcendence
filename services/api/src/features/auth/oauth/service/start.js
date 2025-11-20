// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   start.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:29:27 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 13:13:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";
import { getProvider } from "./providers.js";

export async function startOAuth(fastify, providerName, next, reply) {
    const p = getProvider(fastify, providerName);

    // Classic server-side OAuth → no verifier, just CSRF state
    const state = crypto.randomBytes(16).toString("hex");

    // CSRF protection with random state 
    reply.setCookie(`oauth_state_${providerName}`, state, {
        path: `/api/auth/${providerName}/callback`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 min
        secure: !!fastify.config.COOKIE_SECURE,
        signed: true,
    });

    // Store “next” URL (where to go after login)
    reply.setCookie(`oauth_next_${providerName}`, String(next), {
        path: `/api/auth/${providerName}`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 minutes
        secure: !!fastify.config.COOKIE_SECURE,
    });

    // Providers are free to ignore codeChallenge if they don't need it
    const url = p.getAuthUrl(state);
    return url;
}
