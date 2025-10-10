// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   keepSwaggerResponses.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 17:49:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 17:50:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";

export default fp(async function keepSwaggerResponses(fastify, opts) {
    const storedResponses = new Map();

    // 🧩 Capture responses as routes are registered
    fastify.addHook("onRoute", (routeOptions) => {
        if (routeOptions.schema?.response) {
            storedResponses.set(routeOptions.url, routeOptions.schema.response);
            delete routeOptions.schema.response; // remove from runtime
        }
    });

    // 🧩 Once the server is ready (Swagger has parsed schemas),
    // inject them back into Swagger’s OpenAPI document
    fastify.addHook("onReady", async () => {
        const swagger = fastify.swagger(); // existing OpenAPI object
        if (!swagger?.paths) return;

        for (const [url, responses] of storedResponses.entries()) {
            const pathItem = swagger.paths[url];
            if (!pathItem) continue;

            // Patch every HTTP method defined under this route
            for (const method of Object.keys(pathItem)) {
                if (!pathItem[method].responses) {
                    pathItem[method].responses = {};
                }

                // Merge our saved response schemas into Swagger’s responses
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
