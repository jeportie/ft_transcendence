// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   user.handler.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 15:04:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:07:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/user.controller.js";
import { meSchema } from "../schema/meSchema.js";
import { modifyPwdSchema } from "../schema/modifyPwdSchema.js";

export async function userRoutes(fastify, options) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.get("/me", { ...authGuard, schema: meSchema }, controller.getMe);

    fastify.post("/modify-pwd", { ...authGuard, schema: modifyPwdSchema }, controller.modifyPwd);
}
