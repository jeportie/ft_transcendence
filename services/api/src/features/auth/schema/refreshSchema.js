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
    description: "Uses the HttpOnly refresh cookie to validate and rotate the refresh token, then returns a new access token.",
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
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "Session expired" },
                code: { type: "string", example: "REFRESH_EXPIRED" }
            }
        }
    }
};
