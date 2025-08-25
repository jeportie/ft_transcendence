// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 14:03:19 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
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
// (later) 2FA, OAuth, etc. can be mounted similarly:
// await app.register(twoFaRoutes, { prefix: '/api' });
// await app.register(oauthRoutes, { prefix: '/api' });

const PORT = 5000;
await app.listen({ host: '0.0.0.0', port: PORT });
console.log(`[api] listening on :${PORT}`);
