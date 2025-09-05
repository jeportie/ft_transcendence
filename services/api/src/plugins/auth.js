// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/04 22:53:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { verifyPassword } from "../auth/password.js";

export default fp(async function authRoutes(app) {
    app.post('/auth', async (request, reply) => {
        const { user, pwd } = request.body || {};

        if (!user || !pwd)
            return (reply.code(400).send({
                succes: false,
                error: "Missing credentials",
            }));

        const db = await app.getDb();
        const row = await db.get(
            `SELECT id, username, email, password_hash, role
             FROM    users
             WHERE   username    = ? 
             OR      email       = ?
             LIMIT 1`,
            user, user
        );

        if (!row)
            return (reply.code(401).send({
                succes: false,
                message: "Invalid credentials"
            }));

        const ok = await verifyPassword(row.password_hash, pwd);
        if (!ok)
            return (reply.code(401).send({
                succes: false,
                message: "Invalid password"
            }));

        const token = app.jwt.sign({
            sub: String(row.id),
            username: row.username,
            role: row.role,
        });

        console.log("Token:", token);

        return reply.code(200).send({
            succes: true,
            user: row.username,
            role: row.role,
            token,
            exp: app.config.ACCESS_TOKEN_TTL,
        });
    });

    // GET /api/me - Protected example that requires Bearer token
    app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
        const claims = request.user;
        return ({
            success: true,
            me: claims,
        });
    });
});
