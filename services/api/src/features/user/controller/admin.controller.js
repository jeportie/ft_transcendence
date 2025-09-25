// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:35:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:39:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as service from "../service/admin.service.js";

export async function getUsers(req, reply) {
    const data = await service.getUsers(req.server);
    if (!data)
        return (reply.code(404).send({ message: "list of users is empty" }));
    reply.send(data);
}
