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

import { Fetch, safeGet, safePost, safePut, safeDelete } from "@jeportie/mini-js";
import { type FetchOptions, type SafeResult } from "@jeportie/mini-js";
import { auth } from "./auth.js";
import { logger } from "./logger.js";
import { refreshToken } from "./refreshToken.js";
import { getDeviceFingerprint } from "../spa/utils/getDeviceFingerprint.js";

export async function withCommonHeaders(init: RequestInit) {
    const clientIpRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await clientIpRes.json();
    const fingerprint = getDeviceFingerprint();
    init.headers = {
        ...(init.headers || {}),
        "x-client-ip": ip,
        "x-device-id": fingerprint,
    };
}

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

// should i put this function in API or fetcher methodes ?
function enableCommonHeaders() {
    fetcher.registerBeforeRequest(withCommonHeaders);
}

export const API = {
    ...fetcher,
    Get: <T>(url: string, opts?: RequestInit): Promise<SafeResult<T>> =>
        safeGet<T>(fetcher, url, opts, logger),

    Post: <T>(url: string, body?: object, opts?: RequestInit): Promise<SafeResult<T>> =>
        safePost<T>(fetcher, url, body, opts, logger),

    Put: <T>(url: string, body?: object, opts?: RequestInit): Promise<SafeResult<T>> =>
        safePut<T>(fetcher, url, body, opts, logger),

    Delete: <T>(url: string, body?: object, opts?: RequestInit): Promise<SafeResult<T>> =>
        safeDelete<T>(fetcher, url, body, opts, logger),

};

