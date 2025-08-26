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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __port = 5000;

const app = Fastify({ logger: false });

await app.register(cors, { origin: true });
await app.register(statics, {
    root: path.join(__dirname, "../public"),
    prefix: "/",
});

app.setNotFoundHandler((req, reply) => {
    if (!req.raw.url?.startsWith("/api"))
        return (reply.sendFile("index.html"));
    reply.code(404).send({ error: "Not Found" });
})

app.get('/api/health', async () => {
    return ({
        name: "jerome",
        content: "this is my first api get message in json, youhou",
        time: Date.now,
    });
});

app.post('/api/auth', async (request, reply) => {
    console.log("[POST] /api/auth -> body: ", request.body);

    if (request.body.user === "jeportie" && request.body.pwd === "dub") {
        return ({
            succes: true,
            user: "jeportie",
            pwd: "dub",
        });
    }
    return ({ succes: false });
})

await app.listen({ host: '0.0.0.0', port: __port });
console.log(`[api] server listening on :${__port}`);
