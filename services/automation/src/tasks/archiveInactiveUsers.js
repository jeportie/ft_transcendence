// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   archiveInactiveUsers.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:53:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 17:34:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../shared/db/connection.js";
import { loadSql } from "../../shared/utils/sqlLoader.js";

const PATH = import.meta.url;

export async function archiveInactiveUsers() {
    const db = await getDb();
    const archiveInactiveUsersSql = loadSql(PATH, "./sql/archiveInactiveUsers.sql");
    const deleteInactiveUsersSql = loadSql(PATH, "./sql/deleteInactiveUsers.sql");

    // Count how many users qualify
    const { count } = await db.get(`
        SELECT COUNT(*) AS count
        FROM users u
        JOIN activation_tokens t ON t.user_id = u.id
        WHERE u.is_active = 0
          AND (t.used_at IS NULL OR t.used_at = '')
          AND julianday(t.expires_at) <= julianday('now');
    `);

    if (count > 0) {
        await db.run(archiveInactiveUsersSql);
        await db.run(deleteInactiveUsersSql);
        console.log(`[Cleanup] Archived and deleted ${count} inactive user(s)`);
    } else {
        console.log("[Cleanup] No inactive users to archive");
    }
}
