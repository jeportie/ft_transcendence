// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.service.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:39:30 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:41:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function getUsers(fastify) {
    const db = await fastify.getDb();
    const rows = await db.all(
        "SELECT id, username, email, role, created_at FROM users ORDER BY id"
    );
    return { success: true, users: rows };
}
