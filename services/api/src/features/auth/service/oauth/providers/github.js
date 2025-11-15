// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   github.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/13 13:31:49 by jeportie          #+#    #+#             //
//   Updated: 2025/11/15 15:20:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

function githubGetAuthUrl(fastify, state) {
    const params = new URLSearchParams({
        client_id: fastify.config.GITHUB_CLIENT_ID,
        redirect_uri: fastify.config.GITHUB_REDIRECT_URI,
        scope: "read:user user:email",
        state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

async function githubExchangeCode(fastify, code) {
    // 1. Exchange code -> access_token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Accept": "application/json",
        },
        body: new URLSearchParams({
            client_id: fastify.config.GITHUB_CLIENT_ID,
            client_secret: fastify.config.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: fastify.config.GITHUB_REDIRECT_URI,
        }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
    }

    const accessToken = tokens.access_token;

    // 2. Get profile
    const userRes = await fetch("https://api.github.com/user", {
        headers: {
            // "Authorization": `token ${accessToken}`,
            "Authorization": `Bearer ${accessToken}`,
            "User-Agent": "ft_transcendence",
        },
    });

    const profile = await userRes.json();

    // 3. Get email (GitHub often hides it)
    let email = profile.email;
    if (!email) {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
            headers: {
                // "Authorization": `token ${accessToken}`,
                "Authorization": `Bearer ${accessToken}`,
                "User-Agent": "ft_transcendence",
            },
        });

        const emails = await emailsRes.json();
        const primary = emails.find(e => e.primary && e.verified);
        if (primary) email = primary.email;
    }

    // Normalize shape
    return {
        sub: String(profile.id),
        email: email || null,
        name: profile.name || profile.login,
        picture: profile.avatar_url,
        provider: "github",
    };
}

export function makeGitHubProvider(fastify) {
    return {
        name: "github",

        getAuthUrl: (state) => githubGetAuthUrl(fastify, state),

        exchangeCode: (code) => githubExchangeCode(fastify, code),
    };
}
