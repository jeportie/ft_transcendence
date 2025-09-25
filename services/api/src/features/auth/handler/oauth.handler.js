// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   oauth.handler.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:26:48 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 19:36:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/oauth.controller.js";
import { startSchema } from "../schema/startSchema.js";
import { callbackSchema } from "../schema/callbackSchema.js";

export async function oauthRoutes(fastify, options) {

    fastify.get("/:provider/start", { schema: startSchema }, controller.startOAuth);
    fastify.get("/:provider/callback", { schema: callbackSchema }, controller.handleOAuth);

}
