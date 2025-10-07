// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:07:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 20:11:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as localService from "../service/local/index.js";
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[Auth]";

export async function loginUser(request, reply) {
    try {
        const data = await localService.loginUser(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function registerUser(request, reply) {
    try {
        const data = await localService.registerUser(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function refreshToken(request, reply) {
    try {
        const data = await localService.refreshToken(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function logoutUser(request, reply) {
    try {
        const data = await localService.logoutUser(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function activateUser(request, reply) {
    try {
        const data = await localService.activateUser(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function forgotPwd(request, reply) {
    try {
        const data = await localService.forgotPwd(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}
