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

/**
 * @api {get} /health Health check
 * @apiName GetHealth
 * @apiGroup System
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Returns the current health status of the API and database connection.
 * Useful for monitoring, load balancers, and uptime checks.
 *
 * @apiSuccess {String} status      Health status (e.g. `"ok"`, `"degraded"`, `"unknown"`).
 * @apiSuccess {String} updated_at  ISO8601 timestamp of last update, or `null` if not available.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "status": "ok",
 *     "updated_at": "2025-09-05T14:30:00.000Z"
 *   }
 *
 * @apiErrorExample {json} Error-Response (Database unreachable):
 *   HTTP/1.1 200 OK
 *   {
 *     "status": "unknown",
 *     "updated_at": null
 *   }
 */

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
