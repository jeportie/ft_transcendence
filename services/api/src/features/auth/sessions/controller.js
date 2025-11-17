// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   controller.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:29:08 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 13:37:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as sessionService from "./service/index.js";
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[Auth]";

export async function getSession(request, reply) {
    try {
        const data = await sessionService.getSession(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}

export async function revokeSession(request, reply) {
    try {
        const data = await sessionService.revokeSession(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, request, reply, DOMAIN);
    }
}
