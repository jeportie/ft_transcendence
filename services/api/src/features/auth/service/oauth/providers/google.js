// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   google.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/13 11:25:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 11:36:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { OAuth2Client } from "google-auth-library";

function googleGetAuthUrl(client, state, codeChallenge) {
    const opts = {
        scope: ["openid", "email", "profile"],
        prompt: "select_account",
        access_type: "offline",
        include_granted_scopes: true,
        state,
    }
    if (codeChallenge) {
        opts.code_challenge = codeChallenge;
        opts.code_challenge_method = "S256";
    }
    return client.generateAuthUrl(opts);
}

async function googleExchangeCodePKCE(code, codeVerifier, fastify) {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: fastify.config.GOOGLE_CLIENT_ID,
            redirect_uri: fastify.config.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
            code_verifier: codeVerifier,
        }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error)
        throw new Error(tokens.error_description || tokens.error);

    const userinfo = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    ).then(r => r.json());

    return {
        id: userinfo.sub,
        email: userinfo.email,
        name: userinfo.name,
        picture: userinfo.picture,
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
        getAuthUrl: (state, codeChallenge) =>
            googleGetAuthUrl(client, state, codeChallenge),

        exchangeCodePKCE: (code, codeVerifier) =>
            googleExchangeCodePKCE(code, codeVerifier, fastify),
    };

}

