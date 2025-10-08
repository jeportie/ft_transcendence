// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   jwt.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/04 22:01:47 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 11:25:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async function jwtPlugin(fastify) {
    const conf = fastify.config;

    // Register @fastify/jwt with pwd from env
    await fastify.register(fastifyJwt, {
        secret: conf.JWT_SECRET,
        sign: {
            expiresIn: conf.ACCESS_TOKEN_TTL,
        },
    });

    fastify.decorate("authenticate", async function(request, reply) {
        try {
            const decoded = await request.jwtVerify();

            request.user = {
                username: decoded.username,
                role: decoded.role,
                ...decoded,
            };
        } catch (err) {
            return reply.code(401).send({
                success: false,
                error: "Unauthorized",
            });
        }
    });

    fastify.decorate("authorize", function(...roles) {
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
