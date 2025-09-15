// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:16:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 16:18:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { requireAuth } from "@jeportie/mini-spa";
import { logger } from "./logger.ts";
import { auth } from "./auth.ts";
import { API } from "./api.ts";

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

