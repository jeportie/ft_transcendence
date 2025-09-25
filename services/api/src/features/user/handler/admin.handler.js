// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:22:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:43:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/admin.controller.js";
import { usersSchema } from "../schema/usersSchema.js";

export async function adminRoutes(fastify, options) {

    fastify.get(
        "/users",
        { schema: adminSchema, preHandler: [fastify.authorize("admin")] },
        controller.getUsers
    );

}
