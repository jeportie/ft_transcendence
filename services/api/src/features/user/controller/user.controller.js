// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.controller.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 15:15:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as services from "../service/user.service.js";

export async function getMe(req, reply) {
    const data = services.getHealth(req.server);
    if (!data)
        return (reply.code(404).send({ message: "health check not found" }));
    reply.send(data);
}
