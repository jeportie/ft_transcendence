// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:07:21 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 19:17:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { refreshToken } from "/../service/local/refreshToken.js";
import { logoutUser } from "../service/local/logoutUser.js";
import { loginUser } from "../service/local/loginUser.js";
import { registerUser } from "../service/local/registerUser.js";

export async function loginUser(req, reply) {
    const data = await loginUser(req.server, req, reply);
    if (!data)
        return (reply.code(404).send({ message: "cannot login" }));
    reply.send(data);
}

export async function registerUser(req, reply) {
    const data = await registerUser(req.server, req, reply);
    if (!data)
        return (reply.code(404).send({ message: "cannot register" }));
    if (!data.success)
        return (reply.code(400).send(data));
    reply.send(data);
}

export async function refreshToken(req, reply) {
    const data = await refreshToken(req.server, req, reply);
    if (!data)
        return (reply.code(404).send({ message: "cannot refresh" }));
    reply.send(data);
}

export async function logoutUser(req, reply) {
    const data = await logoutUser(req.server, req, reply);
    if (!data)
        return (reply.code(404).send({ message: "cannot logout" }));
    reply.send(data);
}
