// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   public.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:14:58 by jeportie          #+#    #+#             //
//   Updated: 2025/09/05 16:19:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import health from "../routes/public/health.js";
import auth from "../routes/public/auth.js";

export default fp(async function publicRoutes(app) {
    await app.register(health);
    await app.register(auth);
});
