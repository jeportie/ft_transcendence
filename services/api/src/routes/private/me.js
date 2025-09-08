// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   me.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:27:47 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:59:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * @api {get} /me Get authenticated user (DB lookup)
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Returns the authenticated user’s full profile from the database.  
 * Requires a valid Bearer token in the `Authorization` header.
 *
 * @apiHeader {String} Authorization Bearer access token.
 *
 * @apiSuccess {Boolean} success  Always `true` if token is valid.
 * @apiSuccess {Object}  me       User profile.
 * @apiSuccess {Number}  me.id        User ID.
 * @apiSuccess {String}  me.username  Username.
 * @apiSuccess {String}  me.email     Email address.
 * @apiSuccess {String}  me.role      User role.
 * @apiSuccess {String}  me.created_at ISO8601 creation timestamp.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "me": {
 *       "id": 1,
 *       "username": "jeportie",
 *       "email": "jerome@example.com",
 *       "role": "player",
 *       "created_at": "2025-09-05T14:00:00.000Z"
 *     }
 *   }
 *
 * @apiError (401) Unauthorized Invalid or missing token.
 */

export default async function(app) {
    app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
        const claims = request.user;
        const db = await app.getDb();
        const me = await db.get(
            "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
            Number(claims.sub)
        );
        return ({
            success: true,
            me: me || claims,
        });
    });
};
