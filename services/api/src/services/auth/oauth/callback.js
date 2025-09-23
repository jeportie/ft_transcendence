// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callback.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:34:08 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:44:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "./providers.js";
import { loginUser } from "./local/loginUser.js";

export async function handleOAuthCallback(app, provider, code, state, cookies, reply) {
    // Verify CSRF state
    const cookieName = `oauth_state_${provider}`;
    const raw = req.cookies?.[cookieName];
    const { valid, value } = raw ? req.unsignCookie(raw) : { valid: false, value: null };
    reply.clearCookie(cookieName, { path: `/api/auth/${provider}/callback` });

    if (!valid || !value || !state || state !== value) {
        return (reply.code(400).send({ success: false, error: "Invalid OAuth state" }));
    }

    const p = getProvider(app, provider);
    const profile = await p.exchangeCode(code);

    const db = await app.getDb();
    let user = await db.get("SELECT * FROM users WHERE email = ?", profile.email);
    if (!user) {
        const r = await db.run(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            profile.name || `user_${profile.sub.slice(0, 8)}`,
            profile.email || null,
            "<oauth>",
            "player"
        );
        user = await db.get("SELECT * FROM users WHERE id = ?", r.lastID);
    }

    // Issue your tokens, skipping password
    await loginUser(app, user.email || user.username, null, req, reply, { skipPwd: true });

    // Read & clear the "next" cookie, then redirect back to the SPA
    const nextCookie = `oauth_next_${provider}`;
    const next = cookies?.[nextCookie] || "/dashboard";
    reply.clearCookie(nextCookie, { path: `/api/auth/${provider}` });
    return ({ success: true, redirect: String(next) });
}
