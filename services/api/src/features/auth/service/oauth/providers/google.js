// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   google.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/13 11:25:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 14:19:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { OAuth2Client } from "google-auth-library";

function googleGetAuthUrl(client, state) {
    const opts = {
        scope: ["openid", "email", "profile"],
        prompt: "select_account",
        access_type: "offline",
        include_granted_scopes: true,
        state,
    };
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

    return {
        id: sub,
        email: email || null,
        email_verified: !!email_verified,
        name: name || null,
        picture: picture || null,
        domain: hd || null,
        provider: "google",
    };
}

export function makeGoogleProvider(fastify) {
    const client = new OAuth2Client({
        clientId: fastify.config.GOOGLE_CLIENT_ID,
        clientSecret: fastify.config.GOOGLE_CLIENT_SECRET,
        redirectUri: fastify.config.GOOGLE_REDIRECT_URI,
    });

    return {
        name: "google",
        pkce: false,

        getAuthUrl: (state /*, { codeChallenge } = {} */) =>
            googleGetAuthUrl(client, state),

        exchangeCode: (code /*, _ctx */) =>
            googleExchangeCode(client, fastify, code),
    };
}

