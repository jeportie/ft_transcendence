// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 15:31:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from 'fastify';
import cors from '@fastify/cors';
import statics from '@fastify/static';

import path from 'path';
import { fileURLToPath } from 'url';

import { getDb } from "./db.js"
import { hashPassword, verifyPassword } from "./auth/password.js";
import authRoutes from './auth/auth.js';

(async () => {
    const h = await hashPassword("hello");
    const ok = verifyPassword(h, "hello")
    if (!ok)
        console.error("[auth] argon2 slef-check failed");
})();

const app = Fastify({ logger: false });

app.get('/api/health', async () => {
    const db = await getDb();
    const row = await db.get('SELECT status, updated_at FROM health WHERE id = 1');
    return { status: row?.status ?? 'unknown', updated_at: row?.updated_at ?? null };
});

await app.register(cors, { origin: true });
await app.register(authRoutes, { prefix: "/api" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename);
console.log(__dirname);
console.log(path.join(__dirname, "../public"));

await app.register(statics, {
    root: path.join(__dirname, "../public"),
    prefix: "/",
});

app.setNotFoundHandler((req, reply) => {
    if (!req.raw.url?.startsWith("/api"))
        return (reply.sendFile("index.html"));
    reply.code(404).send({ error: "Not Found" });
})

const PORT = 5000;
await app.listen({ host: '0.0.0.0', port: PORT });
console.log(`[api] listening on :${PORT}`);
