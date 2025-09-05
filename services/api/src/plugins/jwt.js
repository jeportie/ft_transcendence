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
                succes: false,
                error: "Unauthorized",
            });
        }
    });
});
