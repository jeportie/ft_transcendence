// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   providers.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/16 16:51:12 by jeportie          #+#    #+#             //
//   Updated: 2025/09/16 16:58:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { OAuth2Client } from "google-auth-library";

function googleGetAuthUrl(client, state) {
    const opts = {
        scope: ["openid", "email", "profile"],
        prompt: "select_account",
    }
    if (state)
        opts.state = state;
    return client.generateAuthUrl(opts);
}

async function googleExchangeCode(client, fastify, code) {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: fastify.config.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload() || {};
    const {
        sub,
        email,
        email_verified,
        name,
        picture,
        hd,
    } = payload;

    return { sub, email, email_verified, name, picture, hd };
}

export function makeGoogleProvider(fastify) {
    const client = new OAuth2Client({
        clientId: fastify.config.GOOGLE_CLIENT_ID,
        clientSecret: fastify.config.GOOGLE_CLIENT_SECRET,
        redirectUri: fastify.config.GOOGLE_REDIRECT_URI,
    });

    return {
        getAuthUrl: (state) => googleGetAuthUrl(client, state),
        exchangeCode: (code) => googleExchangeCode(client, fastify, code),
    };
}

const registry = {
    google: makeGoogleProvider,
    // github: makeGitHubProvider,
    // fortyTwo: make42Provider,
};

export function getProvider(fastify, name) {
    const factory = registry[name];
    if (!factory) throw new Error(`OAUTH_PROVIDER_UNKNOWN: ${name}`);
    return factory(fastify);
}
