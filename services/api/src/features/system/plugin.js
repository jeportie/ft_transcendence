// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 14:31:49 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 14:35:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { healthRoutes } from "./handler/health.handler.js";

export default fp(async function systemPlugin(fastify) {
    await fastify.register(healthRoutes, { prefix: "/api/system" });
});
