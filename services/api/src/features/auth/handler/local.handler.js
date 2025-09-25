// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   local.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 18:57:53 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 19:06:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/local.controller.js";
import { loginSchema } from "../schema/loginSchema.js";
import { logoutSchema } from "../schema/logoutSchema.js";
import { refreshSchema } from "../schema/refreshSchema.js";
import { registerSchema } from "../schema/registerSchema.js";

export async function localRoutes(fastify, options) {

    fastify.post("/login", { schema: loginSchema }, controller.loginUser);
    fastify.post("/register", { schema: registerSchema }, controller.registerSchema);
    fastify.post("/refresh", { schema: refreshSchema }, controller.refreshToken);
    fastify.post("/logout", { schema: logoutSchema }, controller.logoutUser);

}
