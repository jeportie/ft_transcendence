// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sessions.handler.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 09:50:58 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 15:16:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/sessions.controller.js";
import * as schema from "../schema/sessions/index.js"

export async function sessionsRoutes(fastify, options) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.get("/sessions", { ...authGuard, schema: schema.getSessionSchema }, controller.getSession);

    fastify.post("/sessions/revoke", { ...authGuard, schema: schema.revokeSessionSchema }, controller.revokeSession);
}
