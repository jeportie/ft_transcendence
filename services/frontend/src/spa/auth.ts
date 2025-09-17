// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auth.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:15:20 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 16:18:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AuthService } from "@jeportie/mini-spa";
import { logger } from "./logger.ts";
import { refreshToken } from "./refreshToken.ts";

export const auth = new AuthService({
    storageKey: "hasSession",
    refreshFn: refreshToken,
    logger,
});

export function markHasSession() {
    localStorage.setItem("hasSession", "true");
}
