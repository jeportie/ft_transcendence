// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   disableSchema.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:51:06 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:52:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const disableSchema = {
    summary: "Disable 2FA",
    description: "Clears the stored secret and disables 2FA for the user.",
    tags: ["2FA"],
    operationId: "disable2FA",

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
                error: { type: "string", example: "Invalid credentials" },
                code: { type: "string", example: "USER_NOT_FOUND" }
            }
        }
    }
};
