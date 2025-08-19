// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/13 16:38:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({ logger: false });
const PORT = Number(process.env.PORT) || 8000;

app.register(fastifyStatic, {
    root: join(__dirname, "frontend", "static"),
    prefix: "/static/",
    cacheControl: false,
});

app.get("/*", async (_req, reply) => {
    const html = await fs.readFile(join(__dirname, "frontend", "index.html"), "utf8");
    return reply.type("text/html").send(html);
});

await app.listen({ port: PORT, host: "0.0.0.0" });
console.log(`http://localhost:${PORT}`);
