// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:08:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:09:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function getHealth(fastify) {
    const db = await fastify.getDb();
    const row = await db.get(
        'SELECT status, updated_at FROM health WHERE id = 1'
    );
    return {
        status: row?.status ?? "unknown",
        updated_at: row?.updated_at ?? null
    };
}
