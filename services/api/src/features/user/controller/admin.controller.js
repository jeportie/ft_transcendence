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
    try {
        const data = await service.getUsers(req.server);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "NO_USERS":
                return notFound(reply, "No users found");
            default:
                req.server.log.error(err, "[Admin] Unexpected getUsers error");
                return notFound(reply, "Cannot fetch users");
        }
    }
}
