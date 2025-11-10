// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   headers.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 16:56:28 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:43:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { getDeviceFingerprint } from "@system/core/user/getDeviceFingerprint";

export async function withCommonHeaders(init: RequestInit) {
    try {
        const clientIpRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await clientIpRes.json();
        const fingerprint = getDeviceFingerprint();
        init.headers = {
            ...(init.headers || {}),
            "x-client-ip": ip,
            "x-device-id": fingerprint,
        };

    } catch {

    };
}
