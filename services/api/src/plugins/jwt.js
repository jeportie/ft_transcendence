// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   jwt.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/04 22:01:47 by jeportie          #+#    #+#             //
//   Updated: 2025/09/04 22:21:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async function jwtPlugin(app) {
    const conf = app.config;

    // Register @fastify/jwt with pwd from env
    await app.register(fastifyJwt, {
        secret: conf.JWT_SECRET,
        sign: {
            expiresIn: conf.ACCESS_TOKEN_TTL,
        },
    });

    app.decorate("authenticate", async function(request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            return reply.code(401).send({
                success: false,
                error: "Unauthorized",
            });
        }
    });

    app.decorate("authorize", function(...roles) {
        const required = roles.flat().filter(Boolean);
        return (async function(request, reply) {
            if (!request.user) {
                try {
                    await request.jwtVerify();
                } catch {
                    return (reply.code(401).send({
                        success: false,
                        error: "Unauthorized",
                    }));
                };
            }
            if (required.length && !required.includes(request.user.role)) {
                return (reply.code(403).send({
                    success: false,
                    error: "Forbidden",
                }));
            }
        });
    });
});
