// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   docs.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/08 13:02:58 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 16:36:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async function docs(app) {
    await app.register(swagger, {
        mode: "dynamic",
        openapi: {
            info: {
                title: "ft_transcendence API",
                version: "1.1.0",
                description: "Authentication, health, and game endpoints"
            },
            servers: [
                { url: "http://localhost:5000", description: "Local dev" }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                }
            }
        }
    });

    await app.register(swaggerUi, {
        routePrefix: "/docs",
        staticCSP: false,
    });
});
