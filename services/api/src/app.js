// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 17:51:38 by jeportie         ###   ########.fr       //
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
import keepSwaggerResponses from './plugins/keepSwaggerResponses.js';

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
            customOptions: { strict: false },
        },
        schemaErrorFormatter: (errors, dataVar) => {
            const firstErr = errors[0];
            const field =
                firstErr.instancePath?.replace(/^\//, "") ||
                firstErr.params?.missingProperty ||
                "field";
            const message = `${field} ${firstErr.message}`;
            return new Error(`body/${message}`);
        },
    });

    fastify.decorate("config", config);

    await fastify.register(docs);
    await fastify.register(keepSwaggerResponses);

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

    // Serve static assets first
    await fastify.register(statics, {
        root: "/app/public",
        prefix: "/",
    });

    // Debug logging (keep for now)
    fastify.addHook("onRequest", (req, _, done) => {
        if (req.url.match(/\.(js|css|png|svg|jpg|html|map)$/)) {
            console.log("[Static hit]", req.url);
        }
        done();
    });

    // SPA fallback (after static)
    fastify.setNotFoundHandler((req, reply) => {
        const url = req.raw.url || "";

        // Don't intercept:
        // - API requests
        // - Static file requests (anything with a .ext)
        if (url.startsWith("/api") || url.match(/\.[a-zA-Z0-9]+$/)) {
            return reply.code(404).send({ error: "Not Found" });
        }

        // ✅ For /, /login, /dashboard, etc. → send index.html
        return reply.sendFile("index.html");
    });


    return (fastify);
}
