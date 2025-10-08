// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.controller.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 10:50:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as service from "../service/user/index.js";
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
