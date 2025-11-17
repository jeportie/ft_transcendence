// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   cookie.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/08 18:32:27 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:33:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const ALL_CLEAR_PATHS = ["/api/auth", "/api", "/"]; // most specific first

function resolveCookieOptions(fastify, days) {
    const conf = fastify.config;

    // Enforce secure when SameSite=None (browser requirement)
    const sameSite = (conf.COOKIE_SAMESITE || "lax").toLowerCase(); // "lax" | "none" | "strict"

    // Browsers require secure=true when SameSite=None
    let secure = Boolean(conf.COOKIE_SECURE);
    if (sameSite === "none" && !secure) {
        console.warn(
            "[cookie] WARNING: SameSite=None requires secure cookies. Forcing secure=true."
        );
        secure = true;
    }

    return {
        httpOnly: true,
        signed: true,
        secure,
        sameSite,
        path: "/api/auth",
        domain: conf.COOKIE_DOMAIN || undefined,
        maxAge: days * 24 * 60 * 60,
    };
}

export function setRefreshCookie(fastify, reply, rawToken, days) {
    const conf = fastify.config;
    const opts = resolveCookieOptions(fastify, days);

    reply.setCookie(conf.COOKIE_NAME_RT, rawToken, opts);
}

export function clearRefreshCookie(fastify, reply) {
    const conf = fastify.config;

    // Clear using the *same* attributes (path/domain) used when setting.
    for (const p of ALL_CLEAR_PATHS) {
        reply.clearCookie(conf.COOKIE_NAME_RT, {
            path: p,
            domain: conf.COOKIE_DOMAIN || undefined,
        });
    }
}

