// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.controller.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 23:07:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as service from "../service/user.service.js";
import { ok, notFound } from "../../../utils/reply.js";

export async function getMe(req, reply) {
    const data = await service.getMe(req.server);
    if (!data)
        return notFound(reply, "User not found");
    return ok(reply, data);
}
