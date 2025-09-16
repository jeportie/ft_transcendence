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

export default async function oauthRoutes(app) {

    app.get("/auth/:provider/start", async (req, reply) => {
        const { provider } = req.params;
        const p = getProvider(app, provider);
        const url = p.getAuthUrl();
        reply.redirect(url);
    });

    app.get("/auth/:provider/callback", async (req, reply) => {
        const { provider } = req.params;
        const { code } = req.query;
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

        // Reuse your existing login flow but skip password check
        const data = await loginUser(app, user.email || user.username, null, req, reply, { skipPwd: true });
        reply.send(data);
    });
}
