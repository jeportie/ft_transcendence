// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refreshToken.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:14:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 09:28:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { logger } from "@system/core/logger";
import { resolveClientHeaders } from "@system/config/api/resolveClientHeader.js";

const log = logger.withPrefix("[Auth] ");

export async function refreshToken() {
    try {
        const headers = await resolveClientHeaders();

        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers,
        });

        if (res.status === 401) {
            log.warn("[Auth] Refresh → 401 (not logged in)");
            return null;
        }

        if (!res.ok) {
            log.error("[Auth] Refresh failed:", res.status);
            return null;
        }

        const json = await res.json();
        if (json?.token) return json.token;

        log.warn("[Auth] Refresh missing token");
        return null;
    } catch (err) {
        log.error("[Auth] Refresh exception:", err);
        return null;
    }
}

