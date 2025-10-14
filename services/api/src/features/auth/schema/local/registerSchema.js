// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerSchema.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 16:22:08 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 15:07:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const registerSchema = {
    summary: "Register new account",
    description: "Create a new user account with username, email, and password.",
    tags: ["Authentication"],
    operationId: "register",

    body: {
        type: "object",
        required: ["username", "email", "pwd"],
        properties: {
            username: {
                type: "string",
                minLength: 6,
                maxLength: 32,
                description: "Username must be 6–32 chars, alphanumeric/underscore only",
                example: "jeportie_42"
            },
            email: {
                type: "string",
                format: "email",
                description: "Valid email address",
                example: "jeportie@42.fr"
            },
            pwd: {
                type: "string",
                minLength: 8,
                maxLength: 128,
                description: "Password (8–128 characters)",
                example: "S3curePassw0rd!"
            }
        },
    },
    response: {
        200: {
            description: "User successfully registered",
            type: "object",
            required: ["success", "activation_required", "user_id", "username"],
            properties: {
                success: { type: "boolean", example: true },
                activation_required: { type: "boolean", example: true },
                user_id: { type: "integer", example: 2 },
                username: { type: "string", example: "jeportie" },
            },
        },

        400: {
            description: "Validation or user creation error",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "User already exists" },
                code: { type: "string", example: "USER_ALREADY_EXISTS" },
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
