// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   db.js                                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 14:33:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:42:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDb } from "../db/connection.js";
import fp from "fastify-plugin";

export default fp(async function dbPlugin(fastify) {
    fastify.decorate("getDb", getDb);
});
