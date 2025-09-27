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
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[Auth]";

export async function loginUser(req, reply) {
    try {
        const data = await localService.loginUser(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function registerUser(req, reply) {
    try {
        const data = await localService.registerUser(req.server, req);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function refreshToken(req, reply) {
    try {
        const data = await localService.refreshToken(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function logoutUser(req, reply) {
    try {
        const data = await localService.logoutUser(req.server, req, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
