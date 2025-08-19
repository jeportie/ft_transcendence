// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 13:34:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: false });

// CORS: dev-friendly (adjust in prod / behind Nginx)
await app.register(cors, { origin: true });

/**
 * Basic health route
 * (Optional) If you later plug SQLite, you can read from DB here.
 */
app.get('/health', async () => {
    return { status: 'ok', service: 'api', time: new Date().toISOString() };
});

const PORT = Number(process.env.PORT) || 5000;
await app.listen({ host: '0.0.0.0', port: PORT });
console.log(`[api] listening on :${PORT}`);
