// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifyBackuopSchema.js                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:50:54 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 17:40:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const verifySchema = {
    summary: "Verify backup code",
    description: "Verify a one-time backup code (issued when enabling 2FA). Each code can only be used once.",
    tags: ["Authentication", "2FA"],
    operationId: "verifyBackup",

    body: {
        type: "object",
        required: ["code"],
        properties: {
            code: {
                type: "string",
                minLength: 8,
                maxLength: 16,
                example: "12ab-34cd"
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
                user: { type: "string", example: "alice" },
                role: { type: "string", example: "user" },
                token: { type: "string", description: "JWT access token" },
                exp: { type: "number", example: 3600 },
            },
        },
        400: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing credentials" },
                code: { type: "string", example: "MISSING_CREDENTIALS" }
            }
        },
        401: {
            type: "object",
            required: ["success", "code", "message"],
            properties: {
                success: { type: "boolean", example: false },
                code: { type: "string", example: "BACKUP_EXHAUSTED" },
                message: { type: "string", example: "This backup code was already used" },
            },
        },
        500: { $ref: "internalServerErrorResponse#" },
    }
};
