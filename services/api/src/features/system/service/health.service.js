// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.service.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:08:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 14:32:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loadSql } from "../../../utils/sqlLoader.js";

const getHealthSql = loadSql(import.meta.url, "./sql/getHealth.sql");

export async function getHealth(fastify) {
    const db = await fastify.getDb();
    const row = await db.get(getHealthSql);
    return {
        status: row?.status ?? "unknown",
        updated_at: row?.updated_at ?? null
    };
}
