// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:35:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 23:06:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as service from "../service/admin.service.js";
import { ok } from "../../../utils/reply.js";
import { AppError } from "../../../utils/AppError.js";

const DOMAIN = "[Admin]";

export async function getUsers(req, reply) {
    try {
        const data = await service.getUsers(req.server);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
