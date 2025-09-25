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
import { getDb } from "./db/connection.js";
import { runMigrations } from "./db/migrations.js";
import { ensureDemoUserHashed } from "./db/hashDemoUserPwd.js";

const app = await buildApp();
const db = await getDb();
await runMigrations(db);
await ensureDemoUserHashed(db);

const { HOST, PORT, NODE_ENV } = app.config;

await app.listen({ host: HOST, port: PORT });
console.log(`[API] server listening on ${HOST}:${PORT} (env=${NODE_ENV})`);
