// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resetPwdSchema.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:12:45 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:12:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const resetPwdSchema = {
    summary: "Reset a user's password using a reset token",
    description:
        "Completes the password reset process. The client must provide the reset token \
        received by email and the new password. The token is verified for validity, usage, \
        and expiration before the password is updated. The token is marked as used after success.",
    tags: ["Authentication"],
    operationId: "resetPassword",

    body: {
        type: "object",
        required: ["token", "pwd"],
        properties: {
            token: {
                type: "string",
                minLength: 16,
                description:
                    "Password reset token received via email (hex-encoded string).",
                example:
                    "5f2b9d4e6c8f4a3b9e1f2c7a6d9e0b4c3a2d1e0f9b8c7d6a5e4f3b2c1d0e9f8",
            },
            pwd: {
                type: "string",
                minLength: 8,
                maxLength: 128,
                description:
                    "New password to set. Must meet the platform’s password policy.",
                example: "MyNewStrongP@ssw0rd",
            },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            description: "Password successfully reset",
            type: "object",
            required: ["success", "message"],
            properties: {
                success: { type: "boolean", example: true },
                message: {
                    type: "string",
                    example: "Password has been changed.",
                },
            },
        },

        400: {
            description: "Missing required fields or token",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing required fields" },
                code: { type: "string", example: "MISSING_FIELDS" },
            },
        },

        401: {
            description: "Invalid or expired reset token",
            oneOf: [
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Invalid or expired reset token" },
                        code: { type: "string", example: "INVALID_RESET_TOKEN" },
                    },
                },
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "This reset token was already used" },
                        code: { type: "string", example: "USED_RESET_PWD_TOKEN" },
                    },
                },
                {
                    type: "object",
                    required: ["success", "error", "code"],
                    properties: {
                        success: { type: "boolean", example: false },
                        error: { type: "string", example: "Reset link expired" },
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
