// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:16:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from 'fastify';
import statics from '@fastify/static';
import cookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

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
    const app = Fastify({ logger: false });

    app.decorate("config", config);

    await app.register(docs);
    await app.register(security);
    await app.register(jwtPlugin);
    await app.register(cookie);
    await app.register(dbPlugin);

    // API
    await app.register(publicRoutes/*, { prefix: "/api" }*/);
    await app.register(privateRoutes/*, { prefix: "/api/private" }*/);

    // Serve statics
    await app.register(statics, {
        root: path.join(__dirname, "../public"),
        prefix: "/",
    });

    // SPA fallback to index.html for non /api paths
    app.setNotFoundHandler((req, reply) => {
        if (!req.raw.url?.startsWith("/api"))
            return (reply.sendFile("index.html"));
        reply.code(404).send({ error: "Not Found" });
    });

    return (app);
}
