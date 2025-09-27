// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   meSchema.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 17:23:24 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 17:23:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const meSchema = {
    summary: "Get authenticated user",
    description: "Returns the authenticated user’s profile. Requires a valid Bearer access token.",
    tags: ["Authentication"],
    operationId: "getMe",

    security: [{ bearerAuth: [] }],

    response: {
        200: {
            type: "object",
            required: ["success", "me"],
            properties: {
                success: { type: "boolean", example: true },
                me: {
                    type: "object",
                    required: ["id", "username", "email", "role", "created_at"],
                    properties: {
                        id: { type: "integer", example: 1 },
                        username: { type: "string", example: "jeportie" },
                        email: { type: "string", example: "jerome@example.com" },
                        role: { type: "string", example: "player" },
                        created_at: {
                            type: "string",
                            format: "date-time",
                            example: "2025-09-05T14:00:00.000Z"
                        }
                    }
                }
            }
        },
        401: {
            type: "object",
            required: ["success", "error", "code", "status", "context"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Unauthorized" },
                code: { type: "string", example: "UNAUTHORIZED" },
                status: { type: "integer", example: 401 },
                context: { type: "string", example: "[User]" }
            }
        },
        404: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "User not found" },
                code: { type: "string", example: "USER_NOT_FOUND" }
            }
        }
    }
};
