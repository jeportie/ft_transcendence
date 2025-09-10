// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   public.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:14:58 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 20:23:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import health from "../routes/public/health.js";
import auth from "../routes/public/auth.js";
import rateLimit from "@fastify/rate-limit";

export default fp(async function publicRoutes(app) {
    // Health route stays unprotected
    await app.register(health, { prefix: "/api" });

    // Scoped instance just for /api/auth/*
    await app.register(async function(authScoped) {
        await authScoped.register(rateLimit, {
            max: 100,
            timeWindow: "1 minute",
            keyGenerator: (request) => request.ip,
            errorResponseBuilder: () => ({
                success: false,
                error: "Too many attempts. Please wait before retrying.",
            }),
        });

        await authScoped.register(auth, { prefix: "/api/auth" });
    });
});
