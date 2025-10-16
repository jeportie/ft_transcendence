// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   archiveInactiveUsers.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:53:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 16:22:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../shared/db/connection.js";
import { loadSql } from "../../shared/utils/sqlLoader.js";

const PATH = import.meta.url;

export async function archiveInactiveUsers() {
    const db = await getDb();
    const archiveInactiveUsersSql = loadSql(PATH, "./sql/archiveInactiveUsers.sql");
    const deleteInactiveUsersSql = loadSql(PATH, "./sql/deleteInactiveUsers.sql");

    const row = await db.run(archiveInactiveUsersSql);

    if (row.changes > 0) {
        await db.run(deleteInactiveUsersSql);
        console.log(`[Cleanup] Archived and deleted ${row.changes} inactive users`);
    } else {
        console.log("[Cleanup] No inactive users to archive");
    }
}
