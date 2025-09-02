// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/13 15:56:02 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:53:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { buildApp } from "./app.js";

const app = await buildApp();

const { HOST, PORT, NODE_ENV } = app.config;

await app.listen({ host: HOST, port: PORT });
console.log(`[api] server listening on ${HOST}:${PORT} (env=${NODE_ENV})`);
