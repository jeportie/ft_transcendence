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
import { localRoutes } from "./handler/local.handler.js";
import { oauthRoutes } from "./handler/oauth.handler.js";

export default fp(async function systemPlugin(app) {
    await app.register(userRoutes, { prefix: "/api/user" });
    await app.register(adminRoutes, { prefix: "/api/admin" });
});
