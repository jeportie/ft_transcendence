// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callback.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:34:08 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 18:53:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { loginUser } from "../local/loginUser.js";
import { loadSql } from "../../../../utils/sqlLoader.js";

const PATH = import.meta.url;
const findUserByEmailSql = loadSql(PATH, "../sql/findUserByEmail.sql");
const createUserSql = loadSql(PATH, "../sql/createUser.sql");
const findUserByIdSql = loadSql(PATH, "../sql/findUserById.sql");

export async function handleOAuthCallback(fastify, provider, code, state, request, reply) {
    // Verify CSRF state
    const cookieName = `oauth_state_${provider}`;
    const raw = request.cookies?.[cookieName];
    const { valid, value } = raw ? request.unsignCookie(raw) : { valid: false, value: null };
    reply.clearCookie(cookieName, { path: `/api/auth/${provider}/callback` });

    if (!valid || !value || !state || state !== value) {
        return (reply.code(400).send({ success: false, error: "Invalid OAuth state" }));
    }

    const p = getProvider(fastify, provider);
    const profile = await p.exchangeCode(code);

    const db = await fastify.getDb();
    let user = await db.get(findUserByEmailSql, { ":email": profile.email });
    if (!user) {
        const r = await db.run(createUserSql, {
            ":username": profile.name || `user_${profile.sub.slice(0, 8)}`,
            ":email": profile.email || null,
            ":password_hash": "<oauth>",
            ":role": "player"
        });
        user = await db.get(findUserByIdSql, { ":id": r.lastID });
    }

    // Issue your tokens, skipping password
    await loginUser(fastify, user.email || user.username, null, request, reply, { skipPwd: true });

    // Read & clear the "next" cookie, then redirect back to the SPA
    const nextCookie = `oauth_next_${provider}`;
    const next = request.cookies?.[nextCookie] || "/dashboard";
    reply.clearCookie(nextCookie, { path: `/api/auth/${provider}` });
    return ({ success: true, redirect: String(next) });
}
