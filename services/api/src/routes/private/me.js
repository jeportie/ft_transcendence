// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   me.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/05 16:27:47 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:59:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default async function(app) {
    app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
        const claims = request.user;
        const db = await app.getDb();
        const me = await db.get(
            "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
            Number(claims.sub)
        );
        return ({
            success: true,
            me: me || claims,
        });
    });
};
