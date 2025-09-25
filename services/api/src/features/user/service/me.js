// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   me.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 15:14:55 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:21:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function getMe(app, claims) {
    const db = await app.getDb();
    const me = await db.get(
        "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
        Number(claims.sub)
    );
    return ({
        success: true,
        me: me || claims,
    });
}
