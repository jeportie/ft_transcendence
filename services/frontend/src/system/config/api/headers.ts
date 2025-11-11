// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   headers.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 16:56:28 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 11:12:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDeviceFingerprint } from "@system/core/user/getDeviceFingerprint";

let cachedIp: string = "";

export async function withCommonHeaders(init: RequestInit) {
    try {
        if (!cachedIp) {
            const clientIpRes = await fetch("https://api.ipify.org?format=json");
            const { ip } = await clientIpRes.json();
            cachedIp = ip;
        }

        const fingerprint = getDeviceFingerprint();
        init.headers = {
            ...(init.headers || {}),
            "x-client-ip": cachedIp,
            "x-device-id": fingerprint,
        };
    } catch (err) {
        console.warn("[Headers] Failed to resolve client info:", err);
    }
}
