// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:14:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:35:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { logger } from "./logger.js";
import { getDeviceFingerprint } from "@jeportie/mini-js/utils";

export async function refreshToken() {
    try {
        const clientIpRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await clientIpRes.json();
        const fingerprint = getDeviceFingerprint();
        console.log(fingerprint);

        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
                "x-client-ip": ip,
                "x-device-id": fingerprint,
            },
        });
        if (res.status === 401) {
            logger.warn("[Auth] Refresh → 401 (not logged in)");
            return null;
        }
        if (!res.ok) {
            logger.error("[Auth] Refresh failed:", res.status);
            return null;
        }
        const json = await res.json();
        if (json && json.token) {
            return json.token;
        }
        logger.warn("[Auth] Refresh missing token");
        return null;
    } catch (err) {
        logger.error("[Auth] Refresh exception:", err);
        return null;
    }
}
