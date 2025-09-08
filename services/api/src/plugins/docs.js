// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   docs.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/08 13:02:58 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 13:07:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export default fp(async function docs(app) {
    await app.register(swagger, {
        mode: "static",
        specification: {
            path: path.join(process.cwd(), "openapi.yaml"),
            baseDir: process.cwd(),
        },

    });

    await app.register(swaggerUi, {
        routePrefix: "/docs",
        staticCSP: false,
    });
});
