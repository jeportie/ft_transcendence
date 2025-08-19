// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 14:37:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getDb } from "./db.js"

const app = Fastify({ logger: false });

await app.register(cors, { origin: true });

app.get('/health', async () => {
    const db = await getDb();
    const row = await db.get('SELECT status, updated_at FROM health WHERE id = 1');
    return { status: row?.status ?? 'unknown', updated_at: row?.updated_at ?? null };
});

const PORT = Number(process.env.PORT) || 5000;
await app.listen({ host: '0.0.0.0', port: PORT });
console.log(`[api] listening on :${PORT}`);
