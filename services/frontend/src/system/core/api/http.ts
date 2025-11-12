// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   http.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 16:38:36 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 09:55:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Fetch } from "@jeportie/mini-fetch";
import { withCommonHeaders } from "@system/config/api/headers.js";
import { logger } from "@system";
import { auth } from "@auth";
import { refreshToken } from "../auth/refreshToken";

export const http = new Fetch("/api", {
    getToken: () => auth.getToken(),
    onToken: (t: any) => auth.setToken(t),
    refreshFn: async () => {
        // const tok = await refreshToken();
        const tok = await auth.refresh();
        if (!tok) {
            auth.clear();
            return null;
        }
        auth.setToken(tok);
        return tok;
    },
    logger,
});

http.registerBeforeRequest(withCommonHeaders);
