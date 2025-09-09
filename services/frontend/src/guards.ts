// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 11:00:35 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 11:01:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { auth } from "./tools/AuthService.js";
import Fetch from "./tools/Fetch.js";

const API = new Fetch("/api");

export const requireAuth = async (ctx: any) => {
    console.log("[Guard] Checking auth for path:", ctx?.path);

    const wanted = (ctx?.path || location.pathname) + (location.search || "") + (location.hash || "");
    const next = encodeURIComponent(wanted);

    if (!auth.isLoggedIn())
        return (`/login?next=${next}`);

    // If token looks expired → proactive refresh
    if (auth.isTokenExpired()) {
        try {
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("refresh failed");
            const json = await res.json();
            if (json?.token) auth.setToken(json.token);
            else throw new Error("missing token");
        } catch {
            auth.clear();
            return `/login?next=${next}`;
        }
    }

    // Definitive backend check
    try {
        const data = await API.get("/me");
        console.log("/me:", data);
        if (data?.success)
            return true;
    } catch (err: any) {
        console.warn("[Guard] /me failed:", err?.status, err?.message);
    }

    auth.clear();

    return (`/login?next=${next}`);
};

export const onBeforeNavigate = (to: string) => {
    if (to.startsWith("/api/"))
        return false;
};
