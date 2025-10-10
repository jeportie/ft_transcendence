// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   keepSwaggerResponses.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:32:33 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:44:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";

export default fp(async function keepSwaggerResponses(fastify, opts) {
    const storedResponses = new Map();

    // Capture and normalize route paths
    fastify.addHook("onRoute", (routeOptions) => {
        if (routeOptions.schema?.response) {
            // Normalize /api/auth/activate/:token → /api/auth/activate/{token}
            const normalizedUrl = routeOptions.url.replace(/:([^/]+)/g, "{$1}");
            storedResponses.set(normalizedUrl, routeOptions.schema.response);
            delete routeOptions.schema.response;
        }
    });

    fastify.addHook("onReady", async () => {
        const swagger = fastify.swagger?.();
        if (!swagger?.paths) return;

        for (const [url, responses] of storedResponses.entries()) {
            const pathItem = swagger.paths[url];
            if (!pathItem) continue;

            for (const method of Object.keys(pathItem)) {
                if (!pathItem[method].responses) {
                    pathItem[method].responses = {};
                }

                for (const [code, schema] of Object.entries(responses)) {
                    pathItem[method].responses[code] = {
                        description: schema.description || "",
                        content: {
                            "application/json": { schema },
                        },
                    };
                }
            }
        }
    });
});

