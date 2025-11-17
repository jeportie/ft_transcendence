// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handler.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:22:17 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 16:52:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "./controller.js";
import { usersSchema } from "./schema/usersSchema.js";

export async function adminRoutes(fastify, options) {
    const authGuard = { preHandler: [fastify.authorize("admin")] };

    fastify.get("/users", { ...authGuard, schema: usersSchema }, controller.getUsers);
}
