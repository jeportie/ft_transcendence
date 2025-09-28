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

export async function enableF2a(req, reply) {
    try {
        const data = await f2aService.enableF2a(req.server, req.user.id);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function verifyTotp(req, reply) {
    try {
        const { code } = req.body || {};
        const data = await f2aService.verifyTotp(req.server, req.user.id, code, req.reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function verifyBackup(req, reply) {
    try {
        const { code } = req.body || {};
        const data = await f2aService.verifyBackup(req.server, req.user.id, code, req.reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function disableF2a(req, reply) {
    try {
        const data = await f2aService.disableF2a(req.server, req.user.id);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function generateBackupCodes(req, reply) {
    try {
        const data = await f2aService.generateBackupCodes(req.server, req.user.id);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
