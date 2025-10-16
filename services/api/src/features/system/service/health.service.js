// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.service.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:08:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 15:04:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { SystemErrors } from "../errors.js";

export async function getHealth(fastify) {
    const db = await fastify.getDb();
    const getHealthSql = fastify.loadSql(import.meta.url, "./sql/getHealth.sql");

    const row = await db.get(getHealthSql);
    if (!row)
        throw SystemErrors.HealthNotFound();

    return {
        status: row.status,
        updated_at: row.updated_at
    };
}
