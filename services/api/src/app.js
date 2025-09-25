// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/09/16 17:57:21 by jeportie         ###   ########.fr       //
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
import publicRoutes from "./plugins/public.js";
import privateRoutes from "./plugins/private.js";

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

    // API
    await fastify.register(publicRoutes);
    await fastify.register(privateRoutes);

    // Serve statics
    await fastify.register(statics, {
        root: path.join(__dirname, "../public"),
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
