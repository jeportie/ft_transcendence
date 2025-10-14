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

import { requireAuth } from "@jeportie/mini-fetch";
import { logger } from "./logger.js";
import { auth } from "./auth.js";
import { API } from "./api.js";

export const guards = {
    requireAuth: requireAuth(auth, {
        loginPath: "/login",
        checkSessionFn: async () => {
            const { data, error } = await API.Get("/user/me");

            if (error) {
                logger.warn("[Guard] /me check failed:", error);
                return false;
            }
            return (data?.success === true);
        },
        logger,
    }),
};

