// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   plugin.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/17 18:03:54 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 18:04:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import { sql } from "./sqlRegistry.generated.js";
// AUTO-GENERATED ROUTES START
import { healthRoutes } from "./health/handler.js";
// AUTO-GENERATED ROUTES END

export default fp(async function systemPlugin(parent) {
    await parent.register(async function(scoped) {
        scoped.decorate("sql", sql);

        // AUTO-REGISTER ROUTES START
        await scoped.register(healthRoutes);
        // AUTO-REGISTER ROUTES END

    }, { prefix: "/api/system" });
});
