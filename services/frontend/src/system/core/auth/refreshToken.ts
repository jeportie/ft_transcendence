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

import { logger } from "@system";
import { resolveClientHeaders } from "@system/config/api/resolveClientHeader.js";

export async function refreshToken() {
    try {
        const headers = await resolveClientHeaders();

        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers,
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
        if (json?.token) return json.token;

        logger.warn("[Auth] Refresh missing token");
        return null;
    } catch (err) {
        logger.error("[Auth] Refresh exception:", err);
        return null;
    }
}

