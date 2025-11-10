// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:16:14 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:52:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { requireAuth } from "@jeportie/mini-auth";
import { API } from "@system";
import { logger } from "@system";
import { auth } from "@auth";

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

