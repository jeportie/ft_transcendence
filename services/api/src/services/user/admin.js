// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:21:47 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:24:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function listUsers(app) {
    const db = await app.getDb();
    const rows = await db.all(
        "SELECT id, username, email, role, created_at FROM users ORDER BY id"
    );
    return { success: true, users: rows };
}
