// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handler.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 16:45:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "./controller.js";
import { healthSchema } from "./schema/healthSchema.js";

export async function healthRoutes(fastify, options) {

    fastify.get('/health', { schema: healthSchema }, controller.getHealth);

};
