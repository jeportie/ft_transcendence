// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableSchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:50:26 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:50:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const enableSchema = {
    summary: "Enable 2FA (init setup)",
    description: "Generates a TOTP secret + QR code for the user to scan with Google Authenticator.",
    tags: ["Authentication"],
    operationId: "enable2FA",

    response: {
        200: {
            type: "object",
            required: ["success", "qr", "otpauth"],
            properties: {
                success: { type: "boolean", example: true },
                qr: { type: "string", description: "QR code (base64 PNG)", example: "data:image/png;base64,iVBOR..." },
                otpauth: { type: "string", description: "otpauth:// URI", example: "otpauth://totp/ft_transcendence:1?secret=ABC123&issuer=ft_transcendence" },
                secret: { type: "string", description: "Generated secret (for debugging)", example: "JBSWY3DPEHPK3PXP" }
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
                error: { type: "string", example: "Failed to generate QR code" },
                code: { type: "string", example: "QR_GENERATE_FAILED" }
            }
        }
    }
};
