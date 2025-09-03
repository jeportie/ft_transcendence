// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:50:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";

export default fp(async function authRoutes(app) {
    app.post('/auth', async (request, reply) => {

        console.log("[POST] /api/auth -> body: ", request.body);
        const { user, pwd } = request.body || {};

        if (!user || !pwd)
            return (reply.code(400).send({
                succes: false,
                error: "Missing credentials",
            }));

        const db = await app.getDb();
        // Allow login by username OR email
        const row = await db.get(
            `SELECT id, username, email, password_hash, role
             FROM    users
             WHERE   username    = ? 
             OR      email       = ?
             LIMIT 1`,
            user, user
        );

        if (!row || pwd !== row.password_hash)
            return (reply.code(401).send({
                succes: false,
                message: "Invalid credentials"
            }));

        return reply.code(200).send({
            succes: true,
            user: row.username,
            role: row.role,
            token: "dev-token",
        });
    });
});
