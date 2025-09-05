// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/05 16:27:10 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { verifyPassword } from "../../auth/password.js";

/**
 * @api {post} /auth Authenticate user
 * @apiName Login
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Authenticates a user using a username or email and password.  
 * Returns a signed JWT token and user info on success.
 *
 * @apiBody {String} user Username or email of the user.
 * @apiBody {String} pwd  Plain-text password of the user.
 *
 * @apiSuccess {Boolean} succes   Indicates request outcome.
 * @apiSuccess {String}  user     Username of the authenticated user.
 * @apiSuccess {String}  role     Role of the user (e.g. `"player"`, `"admin"`).
 * @apiSuccess {String}  token    JWT access token to be used in the `Authorization` header.
 * @apiSuccess {String}  exp      Expiration time (e.g. `"15m"`).
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "succes": true,
 *     "user": "jeportie",
 *     "role": "player",
 *     "token": "eyJhbGciOiJIUzI1NiIs...",
 *     "exp": "15m"
 *   }
 *
 * @apiError (400) MissingCredentials Missing `user` or `pwd` fields.
 * @apiError (401) InvalidCredentials Invalid username/email or password.
 */

/**
 * @api {get} /me Get authenticated user (claims)
 * @apiName GetClaims
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription
 * Returns the decoded claims of the currently authenticated user.  
 * Requires a valid Bearer token in the `Authorization` header.
 *
 * @apiHeader {String} Authorization Bearer access token.
 *
 * @apiSuccess {Boolean} success  Always `true` if token is valid.
 * @apiSuccess {Object}  me       JWT claims of the current user.
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "success": true,
 *     "me": {
 *       "sub": "1",
 *       "username": "jeportie",
 *       "role": "player",
 *       "iat": 1693923812,
 *       "exp": 1693924712
 *     }
 *   }
 *
 * @apiError (401) Unauthorized Invalid or missing token.
 */

export default async function(app) {
    app.post('/auth', async (request, reply) => {
        const { user, pwd } = request.body || {};

        if (!user || !pwd)
            return (reply.code(400).send({
                succes: false,
                error: "Missing credentials",
            }));

        const db = await app.getDb();
        const row = await db.get(
            `SELECT id, username, email, password_hash, role
             FROM    users
             WHERE   username    = ? 
             OR      email       = ?
             LIMIT 1`,
            user, user
        );

        if (!row)
            return (reply.code(401).send({
                succes: false,
                message: "Invalid credentials"
            }));

        const ok = await verifyPassword(row.password_hash, pwd);
        if (!ok)
            return (reply.code(401).send({
                succes: false,
                message: "Invalid password"
            }));

        const token = app.jwt.sign({
            sub: String(row.id),
            username: row.username,
            role: row.role,
        });

        console.log("Token:", token);

        return reply.code(200).send({
            succes: true,
            user: row.username,
            role: row.role,
            token,
            exp: app.config.ACCESS_TOKEN_TTL,
        });
    });
};
