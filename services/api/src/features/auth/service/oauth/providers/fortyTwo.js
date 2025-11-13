// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   fortyTwo.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/13 15:35:00 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 15:35:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

function fortyTwoGetAuthUrl(fastify, state) {
    const params = new URLSearchParams({
        client_id: fastify.config.FORTYTWO_CLIENT_ID,
        redirect_uri: fastify.config.FORTYTWO_REDIRECT_URI,
        response_type: "code",
        scope: "public", // 42 default scope
        state,
    });

    return `https://api.intra.42.fr/oauth/authorize?${params.toString()}`;
}

async function fortyTwoExchangeCode(fastify, code) {
    // 1. Exchange code → access_token
    const tokenRes = await fetch("https://api.intra.42.fr/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: fastify.config.FORTYTWO_CLIENT_ID,
            client_secret: fastify.config.FORTYTWO_CLIENT_SECRET,
            redirect_uri: fastify.config.FORTYTWO_REDIRECT_URI,
            code,
        }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
    }

    const accessToken = tokens.access_token;

    // 2. Fetch profile
    const profileRes = await fetch("https://api.intra.42.fr/v2/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const profile = await profileRes.json();

    // Normalize shape for callback
    return {
        id: profile.id,
        email: profile.email,
        name: profile.displayname || profile.login,
        picture: profile.image?.link || null,
        provider: "42",
    };
}

export function makeFortyTwoProvider(fastify) {
    return {
        name: "42",
        pkce: false, // Classic server-side OAuth

        getAuthUrl: (state) => fortyTwoGetAuthUrl(fastify, state),

        exchangeCode: (code) =>
            fortyTwoExchangeCode(fastify, code),
    };
}
