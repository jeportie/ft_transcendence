// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:22:17 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:42:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/admin.controller.js";
import { usersSchema } from "../schema/usersSchema.js";

export async function adminRoutes(fastify, options) {
    const authGuard = { preHandler: [fastify.authorize("admin")] };

    fastify.get("/users", { ...authGuard, schema: usersSchema }, controller.getUsers);
}
