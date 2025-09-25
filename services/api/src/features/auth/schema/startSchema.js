// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   startSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 23:31:25 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 23:31:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const startSchema = {
    summary: "Start OAuth flow",
    description: "Redirects to the OAuth provider’s authorization URL with proper state and next cookie set.",
    tags: ["Authentication"],
    operationId: "oauthStart",

    params: {
        type: "object",
        required: ["provider"],
        properties: {
            provider: {
                type: "string",
                enum: ["google"], // extend later with github, 42, etc.
                description: "The OAuth provider to use",
            },
        },
    },

    querystring: {
        type: "object",
        properties: {
            next: {
                type: "string",
                description: "Optional path to redirect after login",
                example: "/dashboard",
            },
        },
        additionalProperties: false,
    },

    response: {
        302: {
            description: "Redirects the client to the provider’s OAuth page",
            type: "null",
        },
        400: {
            type: "object",
            required: ["success", "error"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Unknown provider" },
            },
        },
    },
};
