// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 14:33:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:42:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../shared/db/connection.js";
import { runMigrations } from "../../shared/db/migrations.js";
import { loadSql } from "../../shared/utils/sqlLoader.js";
import fp from "fastify-plugin";

export default fp(async function dbPlugin(fastify) {
    fastify.decorate("getDb", getDb);
    fastify.decorate("runMigrations", runMigrations);
    fastify.decorate("loadSql", loadSql);
});
