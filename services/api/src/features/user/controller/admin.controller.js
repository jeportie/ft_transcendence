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
import { ok, notFound } from "../../../utils/reply.js";

export async function getUsers(req, reply) {
    const data = await service.getUsers(req.server);
    if (!data)
        return notFound(reply, "No users found");
    return ok(reply, data);
}
