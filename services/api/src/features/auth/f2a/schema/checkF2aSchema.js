// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   checkF2aSchema.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 22:02:29 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 22:07:52 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const checkF2aSchema = {
    summary: "Check if 2FA is enabled for a user",
    description:
        "This endpoint verifies whether a given username or email has two-factor authentication (2FA) enabled. \
        It is typically used before login to determine if a second verification step is required.",
    tags: ["Authentication"],
    operationId: "isF2aEnabled",

    body: {
        type: "object",
        required: ["user"],
        properties: {
            user: {
                type: "string",
                minLength: 3,
                maxLength: 64,
                description: "Username or email to check for 2FA status",
                example: "jeportie",
            },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            description: "Successfully checked 2FA status",
            type: "object",
            required: ["success", "f2a_enabled"],
            properties: {
                success: { type: "boolean", example: true },
                f2a_enabled: {
                    type: "boolean",
                    description: "Whether 2FA is enabled for the given account",
                    example: true,
                },
            },
        },

        400: {
            description: "Missing or invalid user field",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing credentials" },
                code: { type: "string", example: "MISSING_CREDENTIALS" },
            },
        },

        401: {
            description: "User not found or unauthorized request",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid credentials" },
                code: { type: "string", example: "USER_NOT_FOUND" },
            },
        },

        500: {
            description: "Unexpected internal server error",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Unexpected server error" },
                code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
            },
        },
    },
};

