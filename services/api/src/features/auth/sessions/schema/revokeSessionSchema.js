// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   revokeSessionSchema.js                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:10:15 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 11:49:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const revokeSessionSchema = {
    summary: "Revoke user session",
    description:
        "Revokes a specific user refresh token session, effectively logging out that session. " +
        "If the current session is revoked, related authentication cookies are cleared.",
    tags: ["Authentication"],
    operationId: "revokeSession",

    security: [{ bearerAuth: [] }],

    body: {
        type: "object",
        required: ["sessionId"],
        properties: {
            sessionId: {
                type: "string",
                description: "ID of the session (refresh token) to revoke",
                example: "c1b2b345-6a78-4d90-81e2-1f9f9cd9b6d7"
            }
        },
        additionalProperties: false
    },

    params: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Session ID (alternative to body parameter)",
                example: "c1b2b345-6a78-4d90-81e2-1f9f9cd9b6d7"
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            description: "Session successfully revoked",
            type: "object",
            required: ["success", "revokedId", "currentRevoked"],
            properties: {
                success: { type: "boolean", example: true },
                revokedId: {
                    type: "string",
                    description: "ID of the revoked session",
                    example: "c1b2b345-6a78-4d90-81e2-1f9f9cd9b6d7"
                },
                currentRevoked: {
                    type: "boolean",
                    description:
                        "True if the revoked session was the user's current active session",
                    example: false
                }
            }
        },
        400: {
            description: "Session not found or already revoked",
            type: "object",
            required: ["success", "message", "revokedId"],
            properties: {
                success: { type: "boolean", example: false },
                message: {
                    type: "string",
                    example: "Session not found or already revoked."
                },
                revokedId: {
                    type: "string",
                    example: "c1b2b345-6a78-4d90-81e2-1f9f9cd9b6d7"
                }
            }
        },
        401: {
            description: "Missing or invalid credentials",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing or invalid token" },
                code: { type: "string", example: "AUTH_MISSING_CREDENTIALS" }
            }
        },
        500: {
            description: "Unexpected server error",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Internal Server Error" },
                code: { type: "string", example: "INTERNAL_ERROR" }
            }
        }
    }
};

