// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.controller.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:36:24 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 17:11:52 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as f2aService from "../service/f2a/index.js";
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[Auth 2FA]";

export async function enableF2a(request, reply) {
    try {
        const data = await f2aService.enableF2a(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function verifyTotp(request, reply) {
    try {
        const data = await f2aService.verifyTotp(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function loginTotp(request, reply) {
    try {
        const data = await f2aService.loginTotp(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function verifyBackup(request, reply) {
    try {
        const data = await f2aService.verifyBackup(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function disableF2a(request, reply) {
    try {
        const data = await f2aService.disableF2a(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function generateBackupCodes(request, reply) {
    try {
        const data = await f2aService.generateBackupCodes(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}
