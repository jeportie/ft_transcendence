// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resolveClientHeader.ts                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/12 09:13:34 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 09:22:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDeviceFingerprint } from "@system/core/user/getDeviceFingerprint";

let cachedIp: string = "";

/**
 * Returns common client headers (IP + fingerprint),
 * caching the IP for the session to avoid repeated lookups.
 */
export async function resolveClientHeaders(): Promise<Record<string, string>> {
    try {
        if (!cachedIp) {
            const res = await fetch("https://api.ipify.org?format=json");
            const { ip } = await res.json();
            cachedIp = ip;
        }

        const fingerprint = getDeviceFingerprint();

        return {
            "x-client-ip": cachedIp,
            "x-device-id": fingerprint,
        };
    } catch (err) {
        console.warn("[Headers] Failed to resolve client info:", err);
        return { "x-device-id": getDeviceFingerprint() };
    }
}
