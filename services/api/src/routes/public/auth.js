// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 16:27:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { loginUser, refreshToken, logoutUser } from "../../auth/service.js";
import { loginSchema } from "../../schemas/loginSchema.js";
import { registerSchema } from "../../schemas/registerSchema.js";

export default async function(app) {

    app.post("/login", { schema: loginSchema }, async (req, reply) => {
        const data = await loginUser(app, req.body?.user, req.body?.pwd, req, reply);
        if (data)
            reply.send(data);
    });

    app.post("/register", { schema: registerSchema }, async (req, reply) => {
        // TODO: actually insert into DB + hash password
        reply.send({ success: true, user: req.body.username, role: "player" });
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
