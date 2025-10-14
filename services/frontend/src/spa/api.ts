// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   api.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:11:44 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 16:18:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Fetch, safeGet, safePost, safePut, safeDelete } from "@jeportie/mini-fetch";
import { auth } from "./auth.js";
import { logger } from "./logger.js";
import { refreshToken } from "./refreshToken.js";

const fetcher = new Fetch("/api", {
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

export const API = {
    ...fetcher,
    safeGet: (url) => safeGet(fetcher, url, logger),
    safePost: (url, body) => safePost(fetcher, url, body, logger),
    safePut: (url, body) => safePut(fetcher, url, body, logger),
    safeDelete: (url, body) => safeDelete(fetcher, url, body, logger),
};
