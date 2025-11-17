// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callback.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:34:08 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 13:19:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { loginWithoutPwd } from "../../local/service/loginUser.js";
import { OAuthErrors } from "../../errors.js";

export async function handleOAuthCallback(fastify, providerName, code, state, request, reply) {
    const findOAuthLinkByProviderSubSql = fastify.sql.oauth.findOAuthLinkByProviderSub;
    const createOAuthLinkSql = fastify.sql.oauth.createOAuthLink;
    const findUserByEmailSql = fastify.sql.oauth.findUserByEmail;
    const createUserSql = fastify.sql.oauth.createUser;
    const findUserByIdSql = fastify.sql.oauth.findUserById;
    const activateUserSql = fastify.sql.oauth.activateUser;

    const db = await fastify.getDb();

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
    try {
        profile = await provider.exchangeCode(code);
    } catch (err) {
        fastify.log.error(err, `[OAuth] Provider exchange failed for ${providerName}`);
        throw OAuthErrors.ExchangeFailed();
    }
    profile.sub = String(profile.sub);

    // --- (3) Find or create user in DB ---
    //  (a) Try: find user by (provider, provider_sub)
    let user = await db.get(findOAuthLinkByProviderSubSql, {
        ":provider": providerName,
        ":provider_sub": profile.sub,
    });

    //  (b) Try: find by email, then LINK provider to that user
    if (!user && profile.email) {
        const existing = await db.get(findUserByEmailSql, {
            ":email": profile.email,
        });

        if (existing) {
            user = existing;

            await db.run(createOAuthLinkSql, {
                ":user_id": user.id,
                ":provider": providerName,
                ":provider_sub": profile.sub,
                ":email_at_login": profile.email || null,
                ":profile_picture": profile.picture || null,
            });
        }
    }

    //  (c) Still NO user → create user, then link provider
    if (!user) {
        const username =
            profile.name ||
            `user_${profile.sub.slice(0, 6)}` ||
            `oauth_${providerName}_${Date.now()}`;

        const result = await db.run(createUserSql, {
            ":username": username,
            ":email": profile.email || null,
            ":password_hash": "<oauth>",
            ":role": "player",
        });

        const newId = result.lastID;

        user = await db.get(findUserByIdSql, { ":id": newId });

        await db.run(activateUserSql, { ":user_id": newId });

        await db.run(createOAuthLinkSql, {
            ":user_id": newId,
            ":provider": providerName,
            ":provider_sub": profile.sub,
            ":email_at_login": profile.email || null,
            ":profile_picture": profile.picture || null,
        });
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

