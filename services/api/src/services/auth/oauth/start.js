// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   start.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:29:27 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:33:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";
import { getProvider } from "./providers.js";

export async function startOAuth(app, provider, next, reply) {
    const state = crypto.randomBytes(16).toString("hex");

    // CSRF protection with random state
    reply.setCookie(`oauth_state_${provider}`, state, {
        path: `/api/auth/${provider}/callback`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 min
        secure: !!app.config.COOKIE_SECURE,
        signed: true,
    });

    // Store next URL
    reply.setCookie(`oauth_next_${provider}`, String(next), {
        path: `/api/auth/${provider}`,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 10 * 60, // 10 minutes
        secure: !!app.config.COOKIE_SECURE,
    });

    const p = getProvider(app, provider);
    const url = p.getAuthUrl(state);
    return (url);
}
