// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:57:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 13:18:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/local.controller.js";
import * as schema from "../schema/local/index.js";

export async function localRoutes(fastify, options) {

    fastify.post("/login", { schema: schema.loginSchema }, controller.loginUser);
    fastify.post("/register", { schema: schema.registerSchema }, controller.registerUser);
    fastify.post("/refresh", { schema: schema.refreshSchema }, controller.refreshToken);
    fastify.post("/logout", { schema: schema.logoutSchema }, controller.logoutUser);
    fastify.post("/forgot-pwd", { schema: null }, controller.forgotPwd);
    fastify.post("/reset-pwd", { schema: null }, controller.resetPwd);

    fastify.get("/activate/:token", { schema: null }, controller.activateUser);
}
