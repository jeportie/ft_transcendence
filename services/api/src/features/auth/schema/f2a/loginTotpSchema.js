// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginTotpSchema.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:50:54 by jeportie          #+#    #+#             //
//   Updated: 2025/10/02 21:07:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const loginTotpSchema = {
    summary: "Login with TOTP code",
    description: "Login with a 6-digit time-based code from the user’s authenticator app and issue a session.",
    tags: ["2FA"],
    operationId: "loginTotp",

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
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid 2FA code" },
                code: { type: "string", example: "INVALID_2FA_CODE" }
            }
        }
    }
};
