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
import { type FetchOptions, type SafeResult } from "@jeportie/mini-fetch";
import { auth } from "./auth.js";
import { logger } from "./logger.js";
import { refreshToken } from "./refreshToken.js";

const fetcher = new Fetch("/api", {
    getToken: () => auth.getToken(),
    onToken: (t: string | null) => auth.setToken(t),
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
    Get: <T>(url: string): Promise<SafeResult<T>> => safeGet<T>(fetcher, url, logger),
    Post: <T>(url: string, body?: object): Promise<SafeResult<T>> => safePost<T>(fetcher, url, body, logger),
    Put: <T>(url: string, body?: object): Promise<SafeResult<T>> => safePut<T>(fetcher, url, body, logger),
    Delete: <T>(url: string, body?: object): Promise<SafeResult<T>> => safeDelete<T>(fetcher, url, body, logger),
};
