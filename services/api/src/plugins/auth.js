// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 17:50:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";

export default fp(async function authRoutes(app) {
    app.post('/api/auth', async (request, reply) => {
        console.log("[POST] /api/auth -> body: ", request.body);

        if (request.body.user === "jeportie" && request.body.pwd === "dub") {
            return ({
                succes: true,
                user: "jeportie",
                pwd: "dub",
                token: "dev-token"
            });
        }
        return ({ succes: false });
    })
})
