// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   verifySchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:50:54 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:50:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const verifySchema = {
    summary: "Verify 2FA code",
    description: "Validates the 6-digit TOTP code after scanning the QR. If correct, activates 2FA for the user.",
    tags: ["Authentication"],
    operationId: "verify2FA",

    body: {
        type: "object",
        required: ["code"],
        properties: {
            code: {
                type: "string",
                minLength: 6,
                maxLength: 6,
                pattern: "^[0-9]{6}$",
                example: "123456"
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            type: "object",
            required: ["success"],
            properties: {
                success: { type: "boolean", example: true }
            }
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
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid 2FA code" },
                code: { type: "string", example: "INVALID_2FA_CODE" }
            }
        }
    }
};
