// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   usersSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 17:23:48 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 18:43:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const usersSchema = {
    summary: "List all users (admin only)",
    description: "Retrieves the full list of registered users. Access restricted to `admin` role.",
    tags: ["Admin"],
    operationId: "listUsers",

    security: [{ bearerAuth: [] }],

    response: {
        200: {
            type: "object",
            required: ["success", "users"],
            properties: {
                success: { type: "boolean", example: true },
                users: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["id", "username", "email", "role", "created_at"],
                        properties: {
                            id: { type: "integer", example: 1 },
                            username: { type: "string", example: "jeportie" },
                            email: { type: "string", example: "jerome@example.com" },
                            role: { type: "string", example: "admin" },
                            created_at: {
                                type: "string",
                                format: "date-time",
                                example: "2025-09-05T14:00:00.000Z"
                            }
                        }
                    }
                }
            }
        },
        401: { description: "Unauthorized", type: "null" },
        403: { description: "Forbidden", type: "null" },
        404: {
            type: "object",
            required: ["success", "error", "code"],
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string", example: "No users found" },
                code: { type: "string", example: "NO_USERS" }
            }
        }
    }
};
