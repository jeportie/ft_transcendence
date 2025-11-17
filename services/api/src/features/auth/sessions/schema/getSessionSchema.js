// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getSessionSchema.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 09:59:43 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 11:42:52 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const getSessionSchema = {
    summary: "Get user sessions",
    description:
        "Returns all active and historical refresh token sessions for the authenticated user, " +
        "including device info, IP address, timestamps, and current session indicator.",
    tags: ["Authentication"],
    operationId: "getSession",

    security: [{ bearerAuth: [] }],

    response: {
        200: {
            description: "List of user sessions",
            type: "object",
            required: ["sessions"],
            properties: {
                sessions: {
                    type: "array",
                    items: {
                        type: "object",
                        required: [
                            "id",
                            "device",
                            "agent",
                            "ip",
                            "createdAt",
                            "lastActiveAt",
                            "expiresAt",
                            "revokedAt",
                            "current"
                        ],
                        properties: {
                            id: {
                                type: "string",
                                example: "13c15c8d-3df2-45cb-930f-b79b5d5b29f0"
                            },
                            device: {
                                type: "string",
                                example: "Mac"
                            },
                            agent: {
                                type: "string",
                                example: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_0)"
                            },
                            ip: {
                                type: "string",
                                example: "192.168.1.15"
                            },
                            createdAt: {
                                type: "string",
                                format: "date-time",
                                example: "2025-10-29T10:32:10.000Z"
                            },
                            lastActiveAt: {
                                type: "string",
                                format: "date-time",
                                example: "2025-10-31T08:22:43.000Z"
                            },
                            expiresAt: {
                                type: "string",
                                format: "date-time",
                                example: "2025-11-29T10:32:10.000Z"
                            },
                            revokedAt: {
                                type: ["string", "null"],
                                format: "date-time",
                                example: null
                            },
                            current: {
                                type: "boolean",
                                example: true
                            }
                        }
                    }
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

