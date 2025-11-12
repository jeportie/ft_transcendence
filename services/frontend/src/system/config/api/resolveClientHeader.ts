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

let cachedIp = "";

let _logger: any = null;
let _loggerModule: any = null;

async function getLog() {
    if (_logger) return _logger;
    if (!_loggerModule) {
        // Dynamically import to break circular graph
        _loggerModule = await import("@system/core/logger.js");
    }
    _logger = _loggerModule.logger.withPrefix("[Headers]");
    return _logger;
}

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
        const log = await getLog();
        log.warn("Failed to resolve client info:", err);
        return { "x-device-id": getDeviceFingerprint() };
    }
}

