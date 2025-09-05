// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   private.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:29:19 by jeportie          #+#    #+#             //
//   Updated: 2025/09/05 16:30:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import me from "../routes/private/me.js";
import adminUsers from "../routes/private/admin.users.js";

export default fp(async function privateRoutes(app) {
    app.addHook("onRequest", app.authenticate);

    await app.register(me); // /me
    await app.register(adminUsers, { prefix: "/admin" }); // /admin/*
});
