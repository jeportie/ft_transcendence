// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   healthSchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 17:21:29 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:19:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const healthSchema = {
    summary: "Health check",
    description: "Returns the current health status of the API and database.",
    tags: ["System"],
    operationId: "getHealth",

    response: {
        200: {
            type: "object",
            required: ["status", "updated_at"],
            properties: {
                status: { type: "string", example: "ok" },
                updated_at: {
                    type: ["string", "null"],
                    format: "date-time",
                    example: "2025-09-05T14:30:00.000Z"
                }
            }
        },
        404: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Health check not found" },
                code: { type: "string", example: "HEALTH_NOT_FOUND" }
            }
        }
    }
};
