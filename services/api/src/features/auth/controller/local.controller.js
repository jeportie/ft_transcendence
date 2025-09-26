// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:07:21 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 23:01:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as localService from "../service/local/index.js";
import { ok, badRequest, notFound } from "../../../utils/reply.js";

export async function loginUser(req, reply) {
    const data = await localService.loginUser(req.server, req, reply);
    if (!data)
        return (notFound(reply, "Cannot login"));
    return ok(reply, data);
}

export async function registerUser(req, reply) {
    const data = await localService.registerUser(req.server, req, reply);
    if (!data)
        return notFound(reply, "Cannot register");
    if (!data.success)
        return badRequest(reply, data.error || "Invalid data");
    return ok(reply, data);
}

export async function refreshToken(req, reply) {
    const data = await localService.refreshToken(req.server, req, reply);
    if (!data)
        return notFound(reply, "Cannot refresh");
    return ok(reply, data);
}

export async function logoutUser(req, reply) {
    const data = await localService.logoutUser(req.server, req, reply);
    if (!data)
        return notFound(reply, "Cannot logout");
    return ok(reply, data);
}
