// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/09/16 17:59:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { buildApp } from "./app.js";
import { getDb } from "../shared/db/connection.js";
import { runMigrations } from "../shared/db/migrations.js";
import { ensureDemoUserHashed } from "../shared/db/hashDemoUserPwd.js";

const fastify = await buildApp();
const db = await getDb();
await runMigrations(db);
await ensureDemoUserHashed(db);

const { HOST, PORT, NODE_ENV } = fastify.config;

await fastify.listen({ host: HOST, port: PORT });
console.log(`[API] server listening on ${HOST}:${PORT} (env=${NODE_ENV})`);
