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

export async function registerUser(fastify, req, reply) {
    const username = req.body?.username;
    const email = req.body?.email;
    const pwd = req.body?.pwd;
    const db = await fastify.getDb();

    // Check duplicates
    const exists = await db.get(
        "SELECT 1 FROM users WHERE username = ? OR email = ?",
        username,
        email
    );
    if (exists) {
        return ({
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

    return ({
        success: true,
        user: username,
        role: "player",
        id: result.lastID
    });
};
