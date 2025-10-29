// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sessions.handler.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 09:50:58 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 11:23:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/sessions.controller.js";
import * as schema from "../schema/sessions/index.js"

export async function sessionsRoutes(fastify, options) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.get("/sessions", { ...authGuard, schema: null /*schema.getSessionSchema*/ }, controller.getSession);

    // fastify.post("/sessions/revoke/:id", { ...authGuard, schema: revokeSessionSchema }, controller.revokeSession);
}
