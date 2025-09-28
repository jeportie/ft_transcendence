// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 17:42:30 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 17:42:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const loginSchema = {
    summary: "Login (issue access & refresh, or request 2FA)",
    description:
        "Authenticate with username/email + password. If 2FA is enabled, the server responds with `f2a_required` instead of issuing tokens.",
    tags: ["Authentication"],
    operationId: "login",

    body: {
        type: "object",
        required: ["user", "pwd"],
        properties: {
            user: {
                type: "string",
                minLength: 3,
                maxLength: 64,
                description: "Username or email of the account",
                example: "jeportie",
            },
            pwd: {
                type: "string",
                minLength: 3,
                maxLength: 128,
                description: "Password (6–128 characters)",
                example: "secret123",
            },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            description: "Either a valid session OR a 2FA challenge",
            oneOf: [
                {
                    type: "object",
                    required: ["success", "user", "role", "token", "exp"],
                    properties: {
                        success: { type: "boolean", example: true },
                        user: { type: "string", example: "jeportie" },
                        role: { type: "string", example: "player" },
                        token: { type: "string", description: "JWT access token" },
                        exp: { type: "string", example: "15m" },
                    },
                },
                {
                    type: "object",
                    required: ["success", "f2a_required", "user_id", "username"],
                    properties: {
                        success: { type: "boolean", example: false },
                        f2a_required: { type: "boolean", example: true },
                        user_id: { type: "integer", example: 42 },
                        username: { type: "string", example: "jeportie" },
                    },
                },
            ],
        },
        400: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing credentials" },
                code: { type: "string", example: "MISSING_CREDENTIALS" },
            },
        },
        401: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid credentials" },
                code: { type: "string", example: "INVALID_PASSWORD" },
            },
        },
    },
};
