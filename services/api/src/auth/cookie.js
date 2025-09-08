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

export function setRefreshCookie(app, reply, rawToken, days) {
    const conf = app.config;
    reply.setCookie(conf.COOKIE_NAME_RT, rawToken, {
        httpOnly: true,
        secure: !!conf.COOKIE_SECURE,
        sameSite: conf.COOKIE_SAMESITE || "lax",
        path: "/api/auth",
        domain: conf.COOKIE_DOMAIN || undefined,
        maxAge: days * 24 * 60 * 60,
    });
}

export function clearRefreshCookie(app, reply) {
    const conf = app.config;
    reply.clearCookie(conf.COOKIE_NAME_RT, {
        path: "/api/auth",
        domain: conf.COOKIE_DOMAIN || undefined,
    });
}
