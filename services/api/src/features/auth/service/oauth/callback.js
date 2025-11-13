// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callback.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:34:08 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 13:14:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { loginWithoutPwd } from "../local/loginUser.js";
import { OAuthErrors } from "../../errors.js";

const PATH = import.meta.url;

export async function handleOAuthCallback(fastify, providerName, code, state, request, reply) {
    const findUserByEmailSql = fastify.loadSql(PATH, "../sql/findUserByEmail.sql");
    const createUserSql = fastify.loadSql(PATH, "../sql/createUser.sql");
    const findUserByIdSql = fastify.loadSql(PATH, "../sql/findUserById.sql");
    const activateUserSql = fastify.loadSql(PATH, "../sql/activateUser.sql");

    // --- (1) Verify CSRF state cookie ---
    const cookieName = `oauth_state_${providerName}`;
    const raw = request.cookies?.[cookieName];
    const { valid, value } = raw ? request.unsignCookie(raw) : { valid: false, value: null };
    reply.clearCookie(cookieName, { path: `/api/auth/${providerName}/callback` });

    if (!valid || !value || !state || state !== value) {
        throw OAuthErrors.InvalidState();
    }

    // --- (2) Ask provider to turn code → profile (PKCE or classic) ---
    const provider = getProvider(fastify, providerName);

    let profile;

    if (provider.pkce) {
        // PKCE: retrieve verifier from DB
        const { consumePkceState } = await import("./oauthPkce.js");
        const codeVerifier = await consumePkceState(fastify, state);

        if (!codeVerifier)
            throw OAuthErrors.InvalidState();

        try {
            profile = await provider.exchangeCode(code, { codeVerifier });
        } catch (err) {
            fastify.log.error(err, `[OAuth] Provider PKCE exchange failed for ${providerName}`);
            throw OAuthErrors.ExchangeFailed();
        }
    } else {
        // Classic server-side OAuth (Google, GitHub, 42...)
        try {
            profile = await provider.exchangeCode(code);
        } catch (err) {
            fastify.log.error(err, `[OAuth] Provider exchange failed for ${providerName}`);
            throw OAuthErrors.ExchangeFailed();
        }
    }

    // --- (3) Find or create user in DB ---
    const db = await fastify.getDb();
    let user = await db.get(findUserByEmailSql, { ":email": profile.email });

    if (!user) {
        try {
            const fallbackUsername =
                profile.name ||
                profile.email ||
                `${profile.provider}_${String(profile.id).slice(0, 8)}`;

            const r = await db.run(createUserSql, {
                ":username": fallbackUsername,
                ":email": profile.email || null,
                ":password_hash": "<oauth>",
                ":role": "player",
            });

            user = await db.get(findUserByIdSql, { ":id": r.lastID });
            await db.run(activateUserSql, { ":user_id": user.id });
        } catch (err) {
            fastify.log.error(err, "[OAuth] User creation failed");
            throw OAuthErrors.UserCreateFailed();
        }
    }

    // --- (4) Attempt passwordless login ---
    const loginResult = await loginWithoutPwd(
        fastify,
        user.email || user.username,
        request,
        reply
    );

    // --- (5) Handle "next" redirection target ---
    const nextCookie = `oauth_next_${providerName}`;
    const next = request.cookies?.[nextCookie] || "/dashboard";
    reply.clearCookie(nextCookie, { path: `/api/auth/${providerName}` });

    // --- (6) Redirect depending on 2FA status ---
    if (loginResult.f2a_required) {
        const redirectUrl =
            `/f2a-login?userId=${loginResult.user_id}` +
            `&next=${encodeURIComponent(next)}`;
        return reply.redirect(redirectUrl);
    }

    return { redirect: String(next) };
}

