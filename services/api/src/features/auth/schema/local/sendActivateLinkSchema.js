// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sendActivateLinkSchema.js                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:16:10 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 10:10:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const activateUserSchema = {
    summary: "Resend the activation link to the user email adresse.",
    description: "Emit a new token if no token has beed found of if the old one has expired.",
    tags: ["Authentication"],
    operationId: "activateUser",

    params: {
        type: "object",
        required: ["user", "email"],
        properties: {
            user: {
                type: "string",
                description: "The username used for connect.",
            },
            email: {
                type: "string",
                description: "The user email used to connect",
            },
        },
    },

    response: {
        200: {
            description: "Link successfully send.",
            type: "object",
            required: ["success", "message"],
            properties: {
                success: { type: "boolean", example: true },
                message: {
                    type: "string",
                    example: "Account activated successfully.",
                },
            },
        },
        401: {
            description: "Invalid credentials or unauthorized",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid credentials" },
                code: { type: "string", example: "INVALID_CREDENTIALS" },
            },
        },

        500: {
            description: "Database or internal server error",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "The database failed" },
                code: { type: "string", example: "DB_FAIL" },
            },
        },
    },
};
