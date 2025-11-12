// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:16:14 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 09:34:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { requireAuth } from "@jeportie/mini-auth";
import { logger } from "@system";
import { auth } from "@auth";
import { UserState } from "@system/core/user/UserState";

/**
 * Global route guards.
 * Ensures the user session is valid using UserState caching instead of raw API calls.
 */
export const guards = {
    requireAuth: requireAuth(auth, {
        loginPath: "/login",
        checkSessionFn: async () => {
            try {
                const user = await UserState.get(true); // force refresh
                if (!user) {
                    logger.warn("[Guard] No active user in UserState");
                    return false;
                }
                logger.info("[Guard] Session check OK for user:", user.username);
                return true;
            } catch (err) {
                logger.error("[Guard] Session check failed:", err);
                return false;
            }
        },
        logger,
    }),
};
