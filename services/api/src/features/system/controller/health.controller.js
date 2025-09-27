// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.controller.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 23:05:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as services from "../service/health.service.js";
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[System]";

export async function getHealth(req, reply) {
    try {
        const data = await services.getHealth(req.server);
        return ok(reply, data);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
