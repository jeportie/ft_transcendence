// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:15:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 17:24:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthService } from "@jeportie/mini-auth";
import { logger } from "./logger.js";
import { refreshToken } from "./refreshToken.js";

export const auth = new AuthService({
    storageKey: "hasSession",
    refreshFn: refreshToken,
    logger,
});

export function markHasSession() {
    localStorage.setItem("hasSession", "true");
}
