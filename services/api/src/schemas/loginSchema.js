// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 16:18:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 16:46:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const loginSchema = {
    summary: "Login (issue access & refresh)",
    description: "Authenticate with username/email + password. Returns a short-lived access token and sets an HttpOnly refresh cookie.",
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
                example: "jeportie"
            },
            pwd: {
                type: "string",
                minLength: 6,
                maxLength: 128,
                description: "Password (6–128 characters)",
                example: "secret123"
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: "object",
            required: ["success", "user", "role", "token", "exp"],
            properties: {
                success: { type: "boolean", example: true },
                user: { type: "string", example: "jeportie" },
                role: { type: "string", example: "player" },
                token: { type: "string", description: "JWT access token" },
                exp: { type: "string", example: "15m" }
            }
        },
        400: {
            type: "object",
            required: ["success", "error"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Password too short" }
            }
        }
    }
};

