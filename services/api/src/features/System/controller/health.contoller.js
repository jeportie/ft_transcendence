// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.contoller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 11:21:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as services from "../service/health.service.js";

export async function getHealth(req, reply) {
    const data = services.getHealth(req.server);
    if (!data)
        return (reply.code(404).send({ message: "health check not found" }));
    reply.send(data);
}
