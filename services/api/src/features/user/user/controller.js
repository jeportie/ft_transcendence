// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   controller.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 16:54:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as service from "./service/index.js";
import { ok } from "../../../utils/reply.js";
import { AppError } from "../../../utils/AppError.js";

const DOMAIN = "[User]";

export async function getMe(request, reply) {
    try {
        const data = await service.getMe(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function modifyPwd(request, reply) {
    try {
        const data = await service.modifyPwd(request.server, request, reply);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
