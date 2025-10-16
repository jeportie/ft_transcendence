// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   debugDatabase.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 17:13:29 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 17:20:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../shared/db/connection.js";

export async function logDbSnapshot() {
    const db = await getDb();

    console.log("\n=== [DEBUG] USERS TABLE ===");
    const users = await db.all("SELECT id, username, is_active, created_at FROM users ORDER BY id;");
    for (const u of users) {
        console.log(`→ id=${u.id}, username=${u.username}, active=${u.is_active}, created=${u.created_at}`);
    }

    console.log("\n=== [DEBUG] ACTIVATION TOKENS TABLE ===");
    const tokens = await db.all(`
    SELECT id, user_id, expires_at, used_at,
           datetime(expires_at) AS expires_at_parsed,
           datetime('now') AS now
    FROM activation_tokens
    ORDER BY user_id;
  `);
    for (const t of tokens) {
        console.log(
            `→ token#${t.id}, user=${t.user_id}, expires_at=${t.expires_at}, parsed=${t.expires_at_parsed}, now=${t.now}, used_at=${t.used_at}`
        );
    }

    console.log("\n=== [DEBUG] POTENTIAL ARCHIVABLE USERS ===");
    const result = await db.all(`
  SELECT 
    u.id, u.username, u.is_active,
    t.expires_at,
    datetime(t.expires_at) AS expires_at_dt,
    datetime('now') AS now
  FROM users u
  JOIN activation_tokens t ON t.user_id = u.id
  WHERE u.is_active = 0
    AND t.used_at IS NULL
  ORDER BY t.expires_at;
`);
    if (result.length === 0) {
        console.log("⚠️ No inactive users found with unused tokens.");
    } else {
        for (const r of result) {
            console.log(
                `Candidate: ${r.username} | expires_at=${r.expires_at} (${r.expires_at_dt}) | now=${r.now}`
            );
        }
    }

    console.log("=== [DEBUG END] ===\n");
}
