// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   oauth.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:36:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 11:49:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as oauthService from "../service/oauth/index.js";
import { AppError } from "../../../utils/AppError.js";

const DOMAIN = "[OAuth]";

export async function startOAuth(req, reply) {
    const { provider } = req.params;
    const { next = "/dashboard" } = req.query || {};

    try {
        const url = await oauthService.startOAuth(req.server, provider, next, reply);
        return reply.redirect(url);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}

export async function handleOAuth(req, reply) {
    const { provider } = req.params;
    const { code, state } = req.query;

    try {
        const data = await oauthService.handleOAuthCallback(
            req.server, provider, code, state, req, reply
        );

        return reply.type("text/html").send(`
          <script>
            localStorage.setItem("hasSession", "true");
            window.location.href = "${data.redirect}";
          </script>
        `);
    } catch (err) {
        return AppError.handle(err, req, reply, DOMAIN);
    }
}
