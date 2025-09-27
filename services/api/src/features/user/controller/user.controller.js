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
    try {
        const data = await service.getMe(req.server, req.user);
        return ok(reply, data);
    } catch (err) {
        switch (err.message) {
            case "USER_NOT_FOUND":
                return notFound(reply, "User not found");
            default:
                req.server.log.error(err, "[User] Unexpected getMe error");
                return notFound(reply, "Cannot fetch user");
        }
    }
}
