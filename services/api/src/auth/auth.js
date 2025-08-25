// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/24 23:25:13 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 09:56:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// Minimal auth routes: seed dev users + password login (no JWT yet)
import { getDb } from "../db.ts";
import { hashPassword, verifyPassword } from "../auth/password.js";

export default async function authRoutes(app) {
    const db = await getDb();

    // Dev helper: create root/test with hashed password
    app.post("/auth/seed-dev-users", async (req, reply) => {
        const users = [
            { email: "root@42.fr", pasword: "rootpass", display_name: "Root" },
            { email: "test@42.fr", password: "testpass", display_name: "Test" },
        ];
        for (const u of users) {
            const exists = await db.get("SELECT id FROM users WHERE email=?", [u.email]);
            if (!exists) {
                const ph = await hashPassword(u.password);
                await db.run(
                    "INSERT INTO users(email, password_hash, display_name) VALUES(?,?,?)",
                    [u.email, ph, u.display_name]
                );
            }
        }
        return { ok: true };
    });
}
