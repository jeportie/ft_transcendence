// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   revokeSessionSchema.js                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 10:10:15 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 10:11:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const revokeSessionSchema = {
    summary: "RevokeSession (delete user refresh token for a session)",
    description:
        "Delete the refresh token for a given session. \
        This will enable the user to disconect from distance on any device",
    tags: ["Authentication"],
    operationId: "getSession",

    security: [{ bearerAuth: [] }],
}
