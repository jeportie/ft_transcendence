// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.users.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:31:56 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:24:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { adminUsersSchema } from "../../schemas/adminUsersSchema.js";

export default async function(app) {
    app.get("/users",
        {
            schema: adminUsersSchema,
            preHandler: [app.authorize("admin")],
        },
        async () => {
            const data = await listUsers(app);
            return (data);
        });
};
