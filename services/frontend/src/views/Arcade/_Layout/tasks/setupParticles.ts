// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupParticles.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/22 15:56:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 14:04:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { runParticle } from "@graphics/particles/particleAnimation.js";

let cleanupFn: (() => void) | null = null;

export async function setupParticles() {
    cleanupFn = runParticle("#layout-arcade-hero-canvas");
}

export function teardownParticles(ctx?: { keepCanvas?: boolean }) {
    const nextIsApp =
        window.location.pathname.startsWith("/dashboard") ||
        window.location.pathname.startsWith("/settings");

    if (nextIsApp || ctx?.keepCanvas === false) {
        cleanupFn?.();
    }
    cleanupFn = null;
}

