// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 14:30:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from 'fastify';
import statics from '@fastify/static';
import cookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';

// Fastify Plugins
import docs from "./plugins/docs.js";
import security from "./plugins/security.js";
import jwtPlugin from "./plugins/jwt.js";
import dbPlugin from "./plugins/db.js";
import metricsPlugin from "./plugins/metrics.js";
import errorHandler from "./plugins/errorHandler.js";

// Features Plugins
import systemPlugin from "./features/system/plugin.js";
import userPlugin from "./features/user/plugin.js";
import authPlugin from "./features/auth/plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp() {
    const fastify = Fastify({
        logger: false,
        ajv: {
            customOptions: {
                strict: false
            }
        },
    });

    fastify.decorate("config", config);


    await fastify.register(docs);
    await fastify.register(security);
    await fastify.register(cookie, {
        secret: fastify.config.JWT_SECRET,
        hook: 'onRequest'
    });
    await fastify.register(jwtPlugin);
    await fastify.register(dbPlugin);
    await fastify.register(metricsPlugin);
    // Global Error Handler
    await fastify.register(errorHandler);

    // Features API
    await fastify.register(systemPlugin);
    await fastify.register(userPlugin);
    await fastify.register(authPlugin);


    // Serve statics
    await fastify.register(statics, {
        // root: path.join(__dirname, "../public"),
        root: "/app/public",
        prefix: "/",
    });

    // SPA fallback to index.html for non /api paths
    fastify.setNotFoundHandler((req, reply) => {
        if (!req.raw.url?.startsWith("/api"))
            return (reply.sendFile("index.html"));
        reply.code(404).send({ error: "Not Found" });
    });

    return (fastify);
}
