// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:15:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:54:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthService } from "@jeportie/mini-auth";
import { logger } from "@system/core/logger";
import { refreshToken } from "./refreshToken.js";

const PUBLIC_PAGES = ["/", "/login", "/signup", "/forgot-pwd"];

export const auth = new AuthService({
    refreshFn: async () => {
        const path = location.pathname;
        const isPublic = PUBLIC_PAGES.includes(path);
        const hasToken = !!auth.getToken();

        if (!hasToken && isPublic) {
            return null;
        }
        if (hasToken && isPublic) {
            return null;
        }
        return await refreshToken();
    },
    logger,
});

