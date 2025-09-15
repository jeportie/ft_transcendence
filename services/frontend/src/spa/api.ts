// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   api.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:11:44 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 16:18:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Fetch } from "@jeportie/mini-spa";
import { auth } from "./auth.ts";
import { logger } from "./logger.ts";
import { refreshToken } from "./refreshToken.ts";

export const API = new Fetch("/api", {
    getToken: () => auth.getToken(),
    onToken: (t) => auth.setToken(t),
    refreshFn: async () => {
        const tok = await refreshToken();
        if (tok) {
            auth.setToken(tok);
            return true;
        }
        auth.clear();
        return false;
    },
    logger,
});
