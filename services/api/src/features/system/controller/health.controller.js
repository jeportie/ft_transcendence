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
import { ok, notFound } from "../../../utils/reply.js";

export async function getHealth(req, reply) {
    const data = await services.getHealth(req.server);
    if (!data)
        return notFound(reply, "Health check not found");
    return ok(reply, data);
}
