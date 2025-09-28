// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 14:31:49 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:48:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { localRoutes } from "./handler/local.handler.js";
import { oauthRoutes } from "./handler/oauth.handler.js";
import { f2aRoutes } from "./handler/f2a.handler.js";

export default fp(async function authPlugin(fastify) {
    // Scoped instance just for /api/auth/*
    await fastify.register(async function(authScoped) {
        await authScoped.register(rateLimit, {
            max: 100,
            timeWindow: "1 minute",
            keyGenerator: (request) => request.ip,
            errorResponseBuilder: () => ({
                success: false,
                error: "Too many attempts. Please wait before retrying.",
            }),
        });

        await authScoped.register(localRoutes);
        await authScoped.register(oauthRoutes);
        await authScoped.register(f2aRoutes);
    }, { prefix: "/api/auth" });
});
