// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 18:09:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from 'fastify';
import statics from '@fastify/static';
import cookie from '@fastify/cookie';
import config from './config/config.js';

// Fastify Plugins
import docs from "./plugins/docs.js";
import security from "./plugins/security.js";
import jwtPlugin from "./plugins/jwt.js";
import dbPlugin from "./plugins/db.js";
import metricsPlugin from "./plugins/metrics.js";
import errorHandler from "./plugins/errorHandler.js";
import keepSwaggerResponses from './plugins/keepSwaggerResponses.js';

// AUTO-GENERATED FEATURES START
import authPlugin from "./features/auth/plugin.js";
import systemPlugin from "./features/system/plugin.js";
import userPlugin from "./features/user/plugin.js";
// AUTO-GENERATED FEATURES END


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

    const jwtObj = {
        secret: fastify.config.JWT_SECRET,
        hook: 'onRequest'
    };

    // OPEN API
    await fastify.register(docs);
    await fastify.register(keepSwaggerResponses);

    // PLUGINS 
    await fastify.register(security);
    await fastify.register(cookie, jwtObj);
    await fastify.register(jwtPlugin);
    await fastify.register(dbPlugin);
    await fastify.register(metricsPlugin);
    await fastify.register(errorHandler);

    // AUTO-REGISTERED FEATURES START
    await fastify.register(authPlugin);
    await fastify.register(systemPlugin);
    await fastify.register(userPlugin);
    // AUTO-REGISTERED FEATURES END

    // Serve static assets first
    await fastify.register(statics, {
        root: "/app/public",
        prefix: "/",
    });

    // SPA fallback (after static)
    fastify.setNotFoundHandler((req, reply) => {
        const url = req.raw.url || "";

        if (url.startsWith("/api") || url.match(/\.[a-zA-Z0-9]+$/)) {
            return reply.code(404).send({ error: "Not Found" });
        }
        return reply.sendFile("index.html");
    });

    return (fastify);
}
