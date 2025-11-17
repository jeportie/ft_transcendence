// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   forgotPwdSchema.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 23:09:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 23:09:47 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const forgotPwdSchema = {
    summary: "Request a password reset email",
    description:
        "Initiates the password reset process for an account associated with the given email. \
        This endpoint verifies the provided reCAPTCHA token, creates a reset token, \
        stores it in the database, and sends a password reset email to the user. \
        The email will contain a reset link valid for 1 hour.",
    tags: ["Authentication"],
    operationId: "forgotPassword",

    body: {
        type: "object",
        required: ["email", "captcha"],
        properties: {
            email: {
                type: "string",
                format: "email",
                description: "The email address associated with the user account.",
                example: "jeportie@example.com",
            },
            captcha: {
                type: "string",
                description:
                    "Google reCAPTCHA verification token to prevent automated abuse.",
                example: "03AF6jDqXyZ...",
            },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            description: "Password reset request processed successfully",
            type: "object",
            required: ["success", "message"],
            properties: {
                success: { type: "boolean", example: true },
                message: {
                    type: "string",
                    example:
                        "If the email exists, we will send a link. Please check your emails.",
                },
            },
        },

        400: {
            description: "Missing or invalid fields or captcha token",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Missing required fields" },
                code: { type: "string", example: "MISSING_FIELDS" },
            },
        },

        401: {
            description: "Invalid reCAPTCHA verification",
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid reCAPTCHA verification" },
                code: { type: "string", example: "INVALID_reCAPTCHA" },
            },
        },

        404: {
            description: "No account found for the given email (silent fail for privacy)",
            type: "object",
            required: ["success", "message"],
            properties: {
                success: { type: "boolean", example: true },
                message: {
                    type: "string",
                    example:
                        "If the email exists, we will send a link. Please check your emails.",
                },
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
