// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   start.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:29:27 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 10:58:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { createPkceState } from "./oauthPkce.js";

export async function startOAuth(fastify, provider, next, reply) {
    const p = getProvider(fastify, provider);
    const { state, codeChallenge } = await createPkceState(fastify);

    // Set state cooke (CSRF + key for PKCE verifier)
    reply.setCookie(`oauth_state_${provider}`, state, {
        path: `/api/auth/${provider}/callback`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 min
        secure: !!fastify.config.COOKIE_SECURE,
        signed: true,
    });

    // Store next URL
    reply.setCookie(`oauth_next_${provider}`, String(next), {
        path: `/api/auth/${provider}`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 minutes
        secure: !!fastify.config.COOKIE_SECURE,
    });

    const url = p.getAuthUrl(state, codeChallenge);
    return (url);
}
