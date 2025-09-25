// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.handler.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 11:25:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/health.contoller.js";
import * as schema from "../schema/health.schema.js";

import { healthSchema } from "../../schemas/healthSchema.js";

export default async function healthRoutes(app) {

    app.get('/health', { schema: healthSchema }, controller.getHealth);

};
