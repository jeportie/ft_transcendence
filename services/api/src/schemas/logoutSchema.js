// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logoutSchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 17:23:09 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 17:23:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const logoutSchema = {
    summary: "Logout (revoke refresh)",
    description: "Deletes the stored refresh token tied to the cookie and clears the cookie. Clients should also discard any in-memory access token.",
    tags: ["Authentication"],
    operationId: "logout",

    response: {
        200: {
            type: "object",
            required: ["success"],
            properties: {
                success: { type: "boolean", example: true }
            }
        }
    }
};
