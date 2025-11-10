// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupMenuSphere.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 09:07:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 15:38:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// import { runMenuSphere } from "../../../../games/sphere/old-runMenuSphere.js";
import { runMenuSphere } from "../../../graphics/sphere/controller/runMenuSphere.js";

let cleanupFn: (() => void) | null = null;

/**
 * Boot the 3D menu sphere system.
 * Attaches Babylon engine + overlay to the canvas selector (#menu-canvas by default).
 */
export function setupMenuSphere() {
    // Prevent duplicate runs
    if (cleanupFn) {
        console.warn("[MenuSphere] Already running — skipping reinit");
        return;
    }
    cleanupFn = runMenuSphere('#app-menu-canvas');
}

/**
 * Cleanly tear down the Babylon engine and overlay
 * (typically called when navigating away from dashboard/settings views)
 */
export function teardownMenuSphere(ctx?: { keepCanvas?: boolean }) {
    const nextIsLanding =
        window.location.pathname === "/" ||
        window.location.pathname.startsWith("/login");

    if (!ctx?.keepCanvas || nextIsLanding) {
        cleanupFn?.();
    }
    cleanupFn = null;
}

