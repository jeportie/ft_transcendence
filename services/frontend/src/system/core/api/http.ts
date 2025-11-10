// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   http.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 16:38:36 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:51:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fetch from "@jeportie/mini-fetch";
import { withCommonHeaders } from "@system/config/api/headers.js";
import { logger } from "@system";
import { auth } from "@auth";

export const http = new Fetch("/api", {
    getToken: () => auth.getToken(),
    onToken: (t: any) => auth.setToken(t),
    refreshFn: async () => {
        const tok = await auth.refresh();   // expose via mini-auth wrapper
        if (tok) { auth.setToken(tok); return true; }
        auth.clear(); return false;
    },
    logger,
});

http.registerBeforeRequest(withCommonHeaders);
