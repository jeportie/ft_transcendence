// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   callbackSchema.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 23:31:33 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 23:31:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const callbackSchema = {
    summary: "OAuth callback",
    description: "Handles the OAuth2 provider redirect, exchanges code for profile, and issues tokens.",
    tags: ["Authentication"],
    operationId: "oauthCallback",

    querystring: {
        type: "object",
        required: ["code", "state"],
        properties: {
            code: { type: "string", description: "Authorization code from provider" },
            state: { type: "string", description: "CSRF state token" },
        },
        additionalProperties: false,
    },

    response: {
        200: {
            type: "object",
            required: ["success", "redirect"],
            properties: {
                success: { type: "boolean", example: true },
                redirect: { type: "string", example: "/dashboard" },
            },
        },
        400: {
            type: "object",
            required: ["success", "error"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Invalid OAuth state" },
            },
        },
    },
};
