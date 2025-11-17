// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   modifyPwdSchema.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:10:43 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:05:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const modifyPwdSchema = {
    summary: "Modify the password of the currently authenticated user",
    description:
        "Allows an authenticated user to change their password. \
        For local accounts, the user must provide their current password. \
        For OAuth-linked accounts, the `oauth` flag can be used to skip verification.",
    tags: ["User"],
    operationId: "modifyPassword",

    security: [
        { bearerAuth: [] },
    ],

    body: {
        type: "object",
        required: ["newPwd"],
        properties: {
            oldPwd: {
                type: "string",
                minLength: 3,
                maxLength: 128,
                description:
                    "The current password of the user (required for local accounts).",
                example: "oldSecret123",
            },
            newPwd: {
                type: "string",
                minLength: 8,
                maxLength: 128,
                description:
                    "The new password to set (must meet security policy requirements).",
                example: "newSecureP@ssw0rd",
            },
            oauth: {
                type: "boolean",
                description:
                    "Indicates if the user is OAuth-based (no old password check).",
                example: false,
            },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            description: "Password successfully updated",
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
            description: "Missing or invalid fields",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing required fields" },
                code: { type: "string", example: "MISSING_FIELDS" },
            },
        },

        401: {
            description: "Invalid credentials or password check failed",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid credentials" },
                code: { type: "string", example: "INVALID_CREDENTIALS" },
            },
        },

        404: {
            description: "User not found in the database",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "User not found" },
                code: { type: "string", example: "USER_NOT_FOUND" },
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
