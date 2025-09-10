// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 17:29:33 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { healthSchema } from "../../schemas/healthSchema.js";

export default async function(app) {
    app.get('/health', { schema: healthSchema }, async () => {
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
