// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   getSessionSchema.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 09:59:43 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 10:11:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const getSessionSchema = {
    summary: "GetSession (get user sessions for management)",
    description:
        "Chek refresh tokens to pare user sessions data on screen. \
        This will enable the user to see where he was connected and with what device",
    tags: ["Authentication"],
    operationId: "getSession",

    security: [{ bearerAuth: [] }],
}

