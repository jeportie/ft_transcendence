// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/05 16:25:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default async function(app) {
    app.get('/health', async () => {
        const db = await app.getDb();
        const row = await db.get(
            'SELECT status, updated_at FROM health WHERE id = 1'
        );
        return ({
            status: row?.status ?? 'unknown',
            updated_at: row?.updated_at ?? null
        });
    });
};
