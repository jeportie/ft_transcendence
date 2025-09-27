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

import { loadSql } from "../../../utils/sqlLoader.js";
import { SystemErrors } from "../errors.js";

const getHealthSql = loadSql(import.meta.url, "./sql/getHealth.sql");

export async function getHealth(fastify) {
    const db = await fastify.getDb();
    const row = await db.get(getHealthSql);
    if (!row)
        throw SystemErrors.HealthNotFound();

    return {
        status: row.status,
        updated_at: row.updated_at
    };
}
