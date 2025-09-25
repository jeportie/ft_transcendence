// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.handler.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:20:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/health.contoller.js";
import { healthSchema } from "../schema/healthSchema.js";

export async function healthRoutes(fastify, options) {

    fastify.get('/health', { schema: healthSchema }, controller.getHealth);

};
