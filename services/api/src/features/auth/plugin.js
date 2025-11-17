// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/17 17:56:47 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 18:02:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { sql } from "./sqlRegistry.generated.js";
// AUTO-GENERATED ROUTES START
import { f2aRoutes } from "./f2a/handler.js";
import { localRoutes } from "./local/handler.js";
import { oauthRoutes } from "./oauth/handler.js";
import { sessionsRoutes } from "./sessions/handler.js";
// AUTO-GENERATED ROUTES END

export default fp(async function authPlugin(parent) {

    await parent.register(async function(scoped) {
        scoped.decorate("sql", sql);

        // AUTO-REGISTER ROUTES START
        await scoped.register(f2aRoutes);
        await scoped.register(localRoutes);
        await scoped.register(oauthRoutes);
        await scoped.register(sessionsRoutes);
        // AUTO-REGISTER ROUTES END

    }, { prefix: "/api/auth" });
});
