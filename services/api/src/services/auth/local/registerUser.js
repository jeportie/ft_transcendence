// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:47:42 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:51:10 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashPassword } from "../password.js";

export async function loginUser(app, user, email, pwd, request, reply, opts = {}) {
    const db = await app.getDb();

    // Check duplicates
    const exists = await db.get(
        "SELECT 1 FROM users WHERE username = ? OR email = ?",
        username,
        email
    );
    if (exists) {
        return reply.code(400).send({
            success: false,
            error: "Username or email already exists"
        });
    }

    // Hash password
    const hashed = await hashPassword(pwd);

    // Insert new user
    const result = await db.run(
        "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
        username,
        email,
        hashed,
        "player"
    );

    return reply.send({
        success: true,
        user: username,
        role: "player"
    });
};

