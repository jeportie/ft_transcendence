// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   hashDemoUserPwd.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/04 18:44:58 by jeportie          #+#    #+#             //
//   Updated: 2025/09/04 18:56:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashPassword } from "../features/auth/service/password.js";

export async function ensureDemoUserHashed(db) {
    const row = await db.get(
        "SELECT id, password_hash FROM users WHERE username = ?",
        "jeportie"
    );
    if (!row)
        return;

    const isHashed = typeof row.password_hash === "string" &&
        row.password_hash.startsWith("$argon2");
    if (isHashed) {
        console.log("[DB] Demo user password already hashed.");
        return;
    }

    const newHash = await hashPassword(row.password_hash);
    await db.run("UPDATE users SET password_hash = ? WHERE id = ?", newHash, row.id);
    console.log("[DB] Updated demo user password to Argon2 hash");
}
