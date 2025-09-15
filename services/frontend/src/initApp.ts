// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   initApp.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 15:20:00 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 14:26:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthService, Fetch, requireAuth } from "@jeportie/mini-spa";

export const logger = {
    info: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};

async function refreshToken() {
    try {
        const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
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

export const auth = new AuthService({
    storageKey: "hasSession",
    refreshFn: refreshToken,
    logger,
});

export const API = new Fetch("/api", {
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

export const guards = {
    requireAuth: requireAuth(auth, {
        loginPath: "/login",
        checkSessionFn: async () => {
            try {
                const data = await API.get("/me");
                return data?.success === true;
            } catch (err) {
                logger.warn("[Guard] /me check failed:", err);
                return false;
            }
        },
        logger,
    }),
};

