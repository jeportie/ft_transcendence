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

export async function purgeExpiredRefreshTokens() {
    const db = await getDb();
    const purgeExpiredRefreshTokensSql = loadSql(PATH, "./sql/purgeExpiredRefreshTokens.sql");

    const result = await db.run(purgeExpiredRefreshTokensSql);
    if (result.changes > 0)
        console.log(`[Cleanup] ✅ Purged ${result.changes} expired refresh tokens`);
    else
        console.log(`[Cleanup] ℹ️ No expired refresh tokens to delete`);

}

