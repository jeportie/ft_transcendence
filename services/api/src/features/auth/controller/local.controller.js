// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:07:21 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 23:01:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as localService from "../service/local/index.js";
import { ok, badRequest, notFound, unauthorized, invalidSession } from "../../../utils/reply.js";

export async function loginUser(req, reply) {
    try {
        const data = await localService.loginUser(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "MISSING_CREDENTIALS":
                return badRequest(reply, "Missing credentials");
            case "USER_NOT_FOUND":
                return unauthorized(reply, "Invalid credentials");
            case "INVALID_PASSWORD":
                return unauthorized(reply, "Invalid credentials");
            default:
                req.server.log.error(err, "[Auth] Unexpected login error");
                return notFound(reply, "Cannot login");
        }
    }
}

export async function registerUser(req, reply) {
    try {
        const data = await localService.registerUser(req.server, req);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "MISSING_FIELDS":
                return badRequest(reply, "Missing required fields");
            case "USER_ALREADY_EXISTS":
                return badRequest(reply, "User already exists");
            default:
                req.server.log.error(err, "[Auth] Unexpected register error");
                return notFound(reply, "Cannot register");
        }
    }
}

export async function refreshToken(req, reply) {
    try {
        const data = await localService.refreshToken(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "NO_REFRESH_COOKIE":
            case "INVALID_REFRESH_COOKIE":
            case "REFRESH_NOT_FOUND":
            case "REFRESH_REVOKED":
            case "REFRESH_EXPIRED":
                return invalidSession(reply);
            default:
                req.server.log.error(err, "[Auth] Unexpected refresh error");
                return notFound(reply, "Cannot refresh");
        }
    }
}

export async function logoutUser(req, reply) {
    try {
        const data = await localService.logoutUser(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "NO_REFRESH_COOKIE":
            case "INVALID_REFRESH_COOKIE":
                return invalidSession(reply, "No active session");
            default:
                req.server.log.error(err, "[Auth] Unexpected logout error");
                return notFound(reply, "Cannot logout");
        }
    }
}
