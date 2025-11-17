// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   activateUserSchema.js                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:16:10 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:18:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const activateUserSchema = {
    summary: "Activate a user account using an activation token",
    description:
        "Activates a newly registered user account using the activation link \
        sent by email. The endpoint verifies the activation token for validity, \
        ensures it has not been used, and marks both the token and user as activated. \
        Expired or invalid tokens will result in appropriate error responses.",
    tags: ["Authentication"],
    operationId: "activateUser",

    params: {
        type: "object",
        required: ["token"],
        properties: {
            token: {
                type: "string",
                minLength: 16,
                description: "The unique activation token sent to the user's email.",
                example:
                    "1a9b3f7e5d6c4b2a8f9e0d1c3b7a6e5f4d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8",
            },
        },
    },

    response: {
        200: {
            description: "Account successfully activated",
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
        400: {
            description: "Missing or invalid activation token",
            oneOf: [
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Missing activation token" },
                        code: { type: "string", example: "MISSING_ACTIVATION_TOKEN" },
                    },
                },
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Invalid or expired token" },
                        code: { type: "string", example: "INVALID_OR_EXPIRED_TOKEN" },
                    },
                },
            ],
        },
        401: {
            description: "Activation link has expired or token already used",
            oneOf: [
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Activation Token already used" },
                        code: { type: "string", example: "USED_ACTIVATION_TOKEN" },
                    },
                },
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Activation link expired" },
                        code: { type: "string", example: "LINK_EXPIRED" },
                    },
                },
            ],
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
