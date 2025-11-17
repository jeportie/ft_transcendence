// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   backupSchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:52:40 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:53:06 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const backupSchema = {
    summary: "Generate backup codes for 2FA",
    description: "Generates 10 single-use backup codes, stores them hashed, and returns plaintext codes once.",
    tags: ["2FA"],
    operationId: "backup2FA",

    response: {
        200: {
            type: "object",
            required: ["success", "codes"],
            properties: {
                success: { type: "boolean", example: true },
                codes: {
                    type: "array",
                    items: { type: "string", example: "A1B2-C3D4" },
                    description: "List of plaintext backup codes (only shown once)"
                }
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
        500: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Failed to generate backup codes" },
                code: { type: "string", example: "BACKUP_GENERATE_FAILED" }
            }
        }
    }
};
