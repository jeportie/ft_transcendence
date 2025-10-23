// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupMenuSphere.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 09:07:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 09:15:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { runMenuSphere } from "../../../../games/sphere/runMenuSphere.js";

let cleanupFn: (() => void) | null = null;

export function setupMenuSphere() {
    cleanupFn = runMenuSphere("#menu-canvas");
}

export function teardownMenuSphere(ctx?: { keepCanvas?: boolean }) {
    const nextIsLanding =
        window.location.pathname === "/" ||
        window.location.pathname.startsWith("/login");

    if (nextIsLanding || ctx?.keepCanvas === false) {
        cleanupFn?.();
    }
    cleanupFn = null;
}
