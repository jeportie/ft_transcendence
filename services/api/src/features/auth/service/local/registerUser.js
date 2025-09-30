// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerUser.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 14:47:42 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 14:51:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { hashPassword } from "../utils/password.js";
import { loadSql } from "../../../../utils/sqlLoader.js";
import { AuthErrors } from "../../errors.js";
import { issueSession } from "../utils/issueSession.js";

const PATH = import.meta.url;
const findUserSql = loadSql(PATH, "../sql/findUserByUsernameOrEmail.sql");
const createUserSql = loadSql(PATH, "../sql/createUser.sql");

export async function registerUser(fastify, request, reply) {
    const username = request.body?.username;
    const email = request.body?.email;
    const pwd = request.body?.pwd;

    if (!username || !email || !pwd)
        throw AuthErrors.MissingFields();

    const db = await fastify.getDb();
    const exists = await db.get(findUserSql, {
        ":username": username,
        ":email": email
    });
    if (exists)
        throw AuthErrors.UserAlreadyExists(username);

    const hashed = await hashPassword(pwd);
    const result = await db.run(createUserSql, {
        ":username": username,
        ":email": email,
        ":password_hash": hashed,
        ":role": "player"
    });

    const row = await db.get(findUserSql, {
        ":username": username,
        ":email": email
    });

    return issueSession(fastify, request, reply, row);

    // Use this when implemented mail confirmation and anti bot registering.
    // return ({
    //     user: username,
    //     role: "player",
    //     id: result.lastID
    // });
};
