// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 14:31:49 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:49:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { userRoutes } from "./handler/user.handler.js";
import { adminRoutes } from "./handler/admin.handler.js";

export default fp(async function userPlugin(fastify) {
    await fastify.register(userRoutes, { prefix: "/user" });
    await fastify.register(adminRoutes, { prefix: "/admin" });
}, { prefix: "/api" });
