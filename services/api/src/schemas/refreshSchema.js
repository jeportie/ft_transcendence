// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshSchema.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 17:22:52 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 17:23:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const refreshSchema = {
    summary: "Refresh access token (rotate refresh)",
    description: "Uses the httpOnly refresh cookie to validate and rotate the refresh token, then returns a new access token.",
    tags: ["Authentication"],
    operationId: "refresh",

    response: {
        200: {
            type: "object",
            required: ["success", "token", "exp"],
            properties: {
                success: { type: "boolean", example: true },
                token: { type: "string", description: "New JWT access token" },
                exp: { type: "string", example: "15m" }
            }
        },
        401: {
            description: "Unauthorized (missing/invalid/expired/rotated elsewhere)",
            type: "null"
        }
    }
};
