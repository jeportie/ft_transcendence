// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   archiveInactiveUsers.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:53:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 11:53:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../api/src/db/connection.js";

export async function archiveInactiveUsers() {
    const db = await getDb();

    await db.exec(`
    CREATE TABLE IF NOT EXISTS archived_users AS
    SELECT * FROM users WHERE 0;
  `);

    const res = await db.run(`
    INSERT INTO archived_users
    SELECT u.*
    FROM users u
    JOIN activation_tokens t ON t.user_id = u.id
    WHERE u.is_active = 0
      AND t.used_at IS NULL
      AND datetime(t.expires_at) <= datetime('now');
  `);

    if (res.changes > 0) {
        await db.run(`
      DELETE FROM users
      WHERE id IN (
        SELECT id FROM archived_users
        WHERE is_active = 0
      );
    `);
        console.log(`[Cleanup] Archived and deleted ${res.changes} inactive users`);
    } else {
        console.log("[Cleanup] No inactive users to archive");
    }
}
