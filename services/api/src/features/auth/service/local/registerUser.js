// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:47:42 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 18:38:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashPassword } from "../password.js";
import { loadSql } from "../../../../utils/sqlLoader.js";

const findUserSql = loadSql(import.meta.url, "../sql/findUserByUsernameOrEmail.sql");
const createUserSql = loadSql(import.meta.url, "../sql/createUser.sql");

export async function registerUser(fastify, req, reply) {
    const username = req.body?.username;
    const email = req.body?.email;
    const pwd = req.body?.pwd;

    if (!username || !email || !pwd)
        throw new Error("MISSING_FIELDS");

    const db = await fastify.getDb();
    const exists = await db.get(findUserSql, {
        ":username": username,
        ":email": email
    });
    if (exists)
        throw new Error("USER_ALREADY_EXISTS");

    const hashed = await hashPassword(pwd);
    const result = await db.run(createUserSql, {
        ":username": username,
        ":email": email,
        ":password_hash": hashed,
        ":role": "player"
    });

    return ({
        user: username,
        role: "player",
        id: result.lastID
    });
};
