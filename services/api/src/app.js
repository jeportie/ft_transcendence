// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:10:34 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:53:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from 'fastify';
import statics from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

import security from "./plugins/security.js";
import dbPlugin from "./plugins/db.js";
import healthRoutes from "./plugins/health.js";
import authRoutes from "./plugins/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp() {
    const app = Fastify({ logger: false });

    app.decorate("config", config);

    await app.register(security);
    await app.register(statics, {
        root: path.join(__dirname, "../public"),
        prefix: "/",
    });
    await app.register(dbPlugin);

    // Routes
    await app.register(healthRoutes, { prefix: '/api' });
    await app.register(authRoutes, { prefix: '/api' });

    // SPA fallback to index.html for non /api paths
    app.setNotFoundHandler((req, reply) => {
        if (!req.raw.url?.startsWith("/api"))
            return (reply.sendFile("index.html"));
        reply.code(404).send({ error: "Not Found" });
    });

    return (app);
}
