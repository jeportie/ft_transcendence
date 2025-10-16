// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   purgeExpiredTokens.js                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:54:18 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 11:54:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../../api/src/db/connection.js";

export async function purgeExpiredTokens() {
    const db = await getDb();
    const res = await db.run(`
    DELETE FROM activation_tokens
    WHERE used_at IS NULL
      AND datetime(expires_at) <= datetime('now');
  `);
    console.log(`[Cleanup] Purged ${res.changes} expired activation tokens`);
}
