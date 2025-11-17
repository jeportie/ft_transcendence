// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 14:31:49 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 16:50:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { userRoutes } from "./user/handler.js";
import { adminRoutes } from "./admin/handler.js";

export default fp(async function userPlugin(fastify) {
    await fastify.register(userRoutes, { prefix: "/api/user" });
    await fastify.register(adminRoutes, { prefix: "/api/admin" });
});
