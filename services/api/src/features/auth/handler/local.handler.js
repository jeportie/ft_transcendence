// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:57:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 20:11:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/local.controller.js";
import { loginSchema } from "../schema/local/loginSchema.js";
import { logoutSchema } from "../schema/local/logoutSchema.js";
import { refreshSchema } from "../schema/local/refreshSchema.js";
import { registerSchema } from "../schema/local/registerSchema.js";

export async function localRoutes(fastify, options) {

    fastify.post("/login", { schema: loginSchema }, controller.loginUser);
    fastify.post("/register", { schema: registerSchema }, controller.registerUser);
    fastify.post("/refresh", { schema: refreshSchema }, controller.refreshToken);
    fastify.post("/logout", { schema: logoutSchema }, controller.logoutUser);
    fastify.post("/forgot-pwd", { schema: null }, controller.forgotPwd);

    fastify.get("/activate/:token", { schema: null }, controller.activateUser);
}
