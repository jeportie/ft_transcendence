// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callback.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:34:08 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 21:01:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { loginWithoutPwd } from "../local/loginUser.js";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { OAuthErrors } from "../../errors.js";

const PATH = import.meta.url;
const findUserByEmailSql = loadSql(PATH, "../sql/findUserByEmail.sql");
const createUserSql = loadSql(PATH, "../sql/createUser.sql");
const findUserByIdSql = loadSql(PATH, "../sql/findUserById.sql");
const activateUserSql = loadSql(PATH, "../sql/activateUser.sql");

export async function handleOAuthCallback(fastify, provider, code, state, request, reply) {
    // --- (1) Verify CSRF state ---
    const cookieName = `oauth_state_${provider}`;
    const raw = request.cookies?.[cookieName];
    const { valid, value } = raw ? request.unsignCookie(raw) : { valid: false, value: null };
    reply.clearCookie(cookieName, { path: `/api/auth/${provider}/callback` });

    if (!valid || !value || !state || state !== value)
        throw OAuthErrors.InvalidState();

    // --- (2) Exchange code for user profile ---
    const p = getProvider(fastify, provider);
    let profile;
    try {
        profile = await p.exchangeCode(code);
    } catch (err) {
        fastify.log.error(err, "[OAuth] Code exchange failed");
        throw OAuthErrors.ExchangeFailed();
    }

    // --- (3) Find or create user in DB ---
    const db = await fastify.getDb();
    let user = await db.get(findUserByEmailSql, { ":email": profile.email });
    if (!user) {
        try {
            const r = await db.run(createUserSql, {
                ":username": profile.name || `user_${profile.sub.slice(0, 8)}`,
                ":email": profile.email || null,
                ":password_hash": "<oauth>",
                ":role": "player"
            });
            user = await db.get(findUserByIdSql, { ":id": r.lastID });
            await db.run(activateUserSql, { ":user_id": user.id });
        } catch (err) {
            fastify.log.error(err, "[OAuth] User creation failed");
            throw OAuthErrors.UserCreateFailed();
        }
    }

    // --- (4) Attempt passwordless login ---
    const loginResult = await loginWithoutPwd(fastify, user.email || user.username, request, reply);

    // --- (5) Handle "next" redirection target ---
    const nextCookie = `oauth_next_${provider}`;
    const next = request.cookies?.[nextCookie] || "/dashboard";
    reply.clearCookie(nextCookie, { path: `/api/auth/${provider}` });

    // --- (6) Redirect depending on 2FA status ---
    if (loginResult.f2a_required) {
        // 2FA enabled → redirect to the 2FA login page
        const redirectUrl = `/f2a-login?userId=${loginResult.user_id}&next=${encodeURIComponent(next)}`;
        return reply.redirect(redirectUrl);
    }

    return ({ redirect: String(next) });
}
