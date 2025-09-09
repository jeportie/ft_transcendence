// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   rateLimit.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/09 19:01:21 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 19:13:19 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

export default fp(async function(app) {
    await app.register(rateLimit, {
        max: 5,
        timeWindow: '1 minute',
        keyGenerator: (request) => request.ip,
        errorResponseBuilder: (request, context) => ({
            success: false,
            author: request.ip,
            context,
            error: "Too many attempts. Please wait before retrying.",
        }),
    });
});
