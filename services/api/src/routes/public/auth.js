// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:57:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //


import { loginUser, refreshToken, logoutUser } from "../../auth/service.js";

export default async function(app) {

    /**
     * @api {post} /auth/login Login (issue access & refresh)
     * @apiName Login
     * @apiGroup Authentication
     * @apiVersion 1.1.0
     *
     * @apiDescription
     * Authenticates a user by username/email + password.  
     * On success:
     * - Returns a short-lived **access token** (JWT) in the JSON body.
     * - Sets a long-lived, httpOnly **refresh token cookie** for rotation-based renewal.
     *
     * @apiBody {String} user Username or email.
     * @apiBody {String} pwd  Plain-text password.
     *
     * @apiSuccess {Boolean} success        Indicates request outcome (note the single `s` to match code).
     * @apiSuccess {String}  user          Authenticated username.
     * @apiSuccess {String}  role          Role of the user (e.g. `"player"`, `"admin"`).
     * @apiSuccess {String}  token         JWT access token to use in `Authorization: Bearer <token>`.
     * @apiSuccess {String}  exp           Access token TTL (e.g. `"15m"`).
     * @apiSuccess (Set-Cookie) {String} refresh_cookie
     *   httpOnly cookie containing the refresh token (cookie name is configured via `COOKIE_NAME_RT`).
     *   Attributes: `HttpOnly; SameSite=Lax|Strict; Path=/; Secure?` depending on env.
     *
     * @apiSuccessExample {json} 200 OK
     *  {
     *    "success": true,
     *    "user": "jeportie",
     *    "role": "player",
     *    "token": "eyJhbGciOiJIUzI1NiIs...",
     *    "exp": "15m"
     *  }
     *
     * @apiError (400) MissingCredentials Missing `user` or `pwd`.
     * @apiError (401) InvalidCredentials Invalid username/email or password.
     */
    app.post("/auth/login", async (req, reply) => {
        const data = await loginUser(app, req.body?.user, req.body?.pwd, req, reply);
        if (data) reply.send(data);
    });

    /**
     * @api {post} /auth/refresh Refresh access token (rotate refresh)
     * @apiName Refresh
     * @apiGroup Authentication
     * @apiVersion 1.1.0
     *
     * @apiDescription
     * Rotates the refresh token (stored as an httpOnly cookie) and returns a **new access token**.  
     * No request body or Authorization header required; the endpoint reads the refresh cookie, validates it
     * (revoked/expired checks), rotates (deletes old, inserts new), sets a **new** refresh cookie, and returns
     * a fresh access token.
     *
     * @apiHeader (Cookie) {String} <COOKIE_NAME_RT>=<refreshToken>
     *
     * @apiSuccess {Boolean} success  Always `true` on success.
     * @apiSuccess {String}  token   New JWT access token.
     * @apiSuccess {String}  exp     Access token TTL (e.g. `"15m"`).
     * @apiSuccess (Set-Cookie) {String} refresh_cookie New rotated refresh cookie.
     *
     * @apiSuccessExample {json} 200 OK
     *  {
     *    "success": true,
     *    "token": "eyJhbGciOiJIUzI1NiIs...",
     *    "exp": "15m"
     *  }
     *
     * @apiError (401) Unauthorized Missing/invalid/expired refresh cookie or revoked token.
     */
    app.post("/auth/refresh", async (req, reply) => {
        const data = await refreshToken(app, req, reply);
        if (data) reply.send(data);
    });

    /**
     * @api {post} /auth/logout Logout (revoke refresh)
     * @apiName Logout
     * @apiGroup Authentication
     * @apiVersion 1.1.0
     *
     * @apiDescription
     * Logs out the current session by deleting the stored refresh token (by cookie hash) and clearing the cookie.
     * Clients should also discard any in-memory access token.
     *
     * @apiHeader (Cookie) {String} <COOKIE_NAME_RT>=<refreshToken>
     *
     * @apiSuccess {Boolean} success Always `true`.
     *
     * @apiSuccessExample {json} 200 OK
     *  { "success": true }
     */
    app.post("/auth/logout", async (req, reply) => {
        const data = await logoutUser(app, req, reply);
        reply.send(data);
    });
}
