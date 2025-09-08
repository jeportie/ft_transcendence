// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.users.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:31:56 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:58:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default async function(app) {
    app.get("/users", { preHandler: [app.authorize("admin")] }, async () => {
        const db = await app.getDb();
        const rows = await db.all(
            "SELECT id, username, email, role, created_at FROM users ORDER BY id"
        );
        return { success: true, users: rows };
    });
};
