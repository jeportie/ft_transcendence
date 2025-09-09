// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 21:14:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loginUser, refreshToken, logoutUser } from "../../auth/service.js";
import validateLoginInput from "../../validation/validateLoginInput.js";

export default async function(app) {

    app.post("/login", async (req, reply) => {
        const error = validateLoginInput(req.body);
        if (error) {
            return (reply.code(400).send({ success: false, error }));
        }
        const data = await loginUser(app, req.body?.user, req.body?.pwd, req, reply);
        if (data)
            reply.send(data);
    });

    app.post("/refresh", async (req, reply) => {
        const data = await refreshToken(app, req, reply);
        if (data)
            reply.send(data);
    });

    app.post("/logout", async (req, reply) => {
        const data = await logoutUser(app, req, reply);
        reply.send(data);
    });
}
