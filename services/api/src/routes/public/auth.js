// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:48:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 19:19:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { refreshToken } from "../../services/auth/local/refreshToken.js";
import { logoutUser } from "../../services/auth/local/logoutUser.js";
import { loginUser } from "../../services/auth/local/loginUser.js";
import { registerUser } from "../../services/auth/local/registerUser.js";

import { loginSchema } from "../../schemas/loginSchema.js";
import { registerSchema } from "../../schemas/registerSchema.js";
import { refreshSchema } from "../../schemas/refreshSchema.js";
import { logoutSchema } from "../../schemas/logoutSchema.js";

export default async function(app) {

    app.post("/login", { schema: loginSchema }, async (req, reply) => {
        const data = await loginUser(app, req.body?.user, req.body?.pwd, req, reply);
        if (data)
            reply.send(data);
    });

    app.post("/register", { schema: registerSchema }, async (req, reply) => {
        const data = await registerUser(app, req.body?.username, req.body?.email, req.body?.pwd);
        if (!data.success)
            return (reply.code(400).send(data));
        reply.send(data);
    });

    app.post("/refresh", { schema: refreshSchema }, async (req, reply) => {
        const data = await refreshToken(app, req, reply);
        if (data)
            reply.send(data);
    });

    app.post("/logout", { schema: logoutSchema }, async (req, reply) => {
        const data = await logoutUser(app, req, reply);
        reply.send(data);
    });
}
