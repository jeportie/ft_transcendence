// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   oauth.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/16 17:02:06 by jeportie          #+#    #+#             //
//   Updated: 2025/09/16 17:40:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getProvider } from "../../oauth/providers.js";
import { loginUser } from "../../auth/service.js";
import crypto from "crypto";

export default async function oauthRoutes(app) {

    app.get("/auth/:provider/start", async (req, reply) => {
        const { provider } = req.params;
        const { next = "/dashboard" } = req.query || {};
        const state = crypto.randomBytes(16).toString("hex");

        // CSRF protection with random state
        reply.setCookie(`oauth_state_${provider}`, state, {
            path: `/api/auth/${provider}/callback`,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 10 * 60, // 10 min
            secure: !!app.config.COOKIE_SECURE,
            signed: true,
        });

        // Store next URL
        reply.setCookie(`oauth_next_${provider}`, String(next), {
            path: `/api/auth/${provider}`,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 10 * 60, // 10 minutes
            secure: !!app.config.COOKIE_SECURE,
        });

        const p = getProvider(app, provider);
        const url = p.getAuthUrl(state);
        reply.redirect(url);
    });

    app.get("/auth/:provider/callback", async (req, reply) => {
        const { provider } = req.params;
        const { code, state } = req.query;

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
        const next = req.cookies?.[nextCookie] || "/dashboard";
        reply.clearCookie(nextCookie, { path: `/api/auth/${provider}` });

        // Important: redirect so the browser leaves the JSON page
        reply.redirect(String(next));
    });
}
