// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.users.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:31:56 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:58:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * @api {get} /users List all users (admin only)
 * @apiName ListUsers
 * @apiGroup Admin
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Retrieves the full list of registered users.  
 * Access restricted to `admin` role.
 *
 * @apiHeader {String} Authorization Bearer access token (admin role required).
 *
 * @apiSuccess {Boolean} success Indicates request outcome.
 * @apiSuccess {Object[]} users  List of users.
 * @apiSuccess {Number}   users.id        User ID.
 * @apiSuccess {String}   users.username  Username.
 * @apiSuccess {String}   users.email     Email address.
 * @apiSuccess {String}   users.role      User role.
 * @apiSuccess {String}   users.created_at Creation timestamp (ISO8601).
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "users": [
 *       {
 *         "id": 1,
 *         "username": "jeportie",
 *         "email": "jerome@example.com",
 *         "role": "admin",
 *         "created_at": "2025-09-05T14:00:00.000Z"
 *       }
 *     ]
 *   }
 *
 * @apiError (403) Forbidden User is not an admin.
 * @apiError (401) Unauthorized Invalid or missing token.
 */

export default async function(app) {
    app.get("/users", { preHandler: [app.authorize("admin")] }, async () => {
        const db = await app.getDb();
        const rows = await db.all(
            "SELECT id, username, email, role, created_at FROM users ORDER BY id"
        );
        return { success: true, users: rows };
    });
};
