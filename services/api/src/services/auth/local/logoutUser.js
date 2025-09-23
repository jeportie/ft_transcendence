// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logoutUser.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:37:10 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:37:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export async function logoutUser(app, request, reply) {
    const name = app.config.COOKIE_NAME_RT;
    const rawSigned = request.cookies?.[name];
    if (rawSigned) {
        const { valid, value: raw } = request.unsignCookie(rawSigned);
        if (valid && raw) {
            const hash = hashToken(raw);
            const db = await app.getDb();
            await db.run(`DELETE FROM refresh_tokens WHERE token_hash = ?`, hash);
        }
    }
    clearRefreshCookie(app, reply);
    return { success: true };
}
