// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.handler.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:04:53 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 15:13:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/user.contoller.js";
import * as schema from "../schema/user.schema.js";

export async function userRoutes(fastify, options) {

    fastify.get("/me", { schema: schema.meSchema, preHandler: null }, controller.getMe);

}
