// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   security.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:23:02 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:18:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";

export default fp(async function security(fastify) {
    const config = fastify.config;
    const origin = config.CORS_ORIGIN?.trim();

    await fastify.register(cors, {
        origin: origin || false,
        credentials: true,
    });

    // Minimal hardening headers (helmet-like things come later if you want)
    fastify.addHook("onSend", async (_req, reply, payload) => {
        reply.header("X-Content-Type-Options", "nosniff");
        reply.header("X-Frame-Options", "SAMEORIGIN");
        reply.header("X-XSS-Protection", "0");
        // CSP comes later when we know all assets/endpoints
        return payload;
    });

    fastify.decorate("hashPassword", hashPassword);
    fastify.decorate("verifyPassword", verifyPassword);
});
