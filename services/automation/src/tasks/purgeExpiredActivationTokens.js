// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   purgeExpiredTokens.js                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:54:18 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 16:22:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../shared/db/connection.js";
import { loadSql } from "../../shared/utils/sqlLoader.js";

const PATH = import.meta.url;

export async function purgeExpiredActivationTokens() {
    const db = await getDb();
    const purgeExpiredTokensSql = loadSql(PATH, "./sql/purgeExpiredTokens.sql");

    const row = await db.run(purgeExpiredTokensSql);
    console.log(`[Cleanup] Purged ${row.changes} expired activation tokens`);
}
