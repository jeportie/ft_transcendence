// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   errorHandler.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/08 13:29:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 15:04:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default async function errorHandler(fastify, options) {
    fastify.setErrorHandler((error, request, reply) => {
        reply.header("content-type", "application/json");

        if (error.validation || error.validationContext || error.statusCode === 400) {
            const message =
                error.message ||
                (error.validation && error.validation[0]?.message) ||
                "Validation failed";

            return reply.status(400).send({
                success: false,
                code: "VALIDATION_ERROR",
                error: message,
                details: error.validation || null,
            });
        }

        if (error.code && error.message) {
            return reply.status(error.statusCode || 500).send({
                success: false,
                code: error.code,
                error: error.message,
            });
        }

        if (error.code === "FST_ERR_VALIDATION") {
            return reply.status(400).send({
                success: false,
                code: "VALIDATION_ERROR",
                error: error.message,
                details: error.validation || null,
            });
        }

        return reply.status(500).send({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            error: error.message || "Unexpected server error",
        });
    });
}

