// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   admin.user.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:31:56 by jeportie          #+#    #+#             //
//   Updated: 2025/09/05 16:33:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default async function(app) {
    app.addHook("onRequest", app.authorize("admin"));

    app.get("/users", async () => {
        const db = await app.getDb();
        const rows = await db.all(
            "SELECT id, username, email, role, created_at FROM users ORDER BY id"
        );
        return { succes: true, users: rows };
    });
}
