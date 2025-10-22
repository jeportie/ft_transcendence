// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupParticles.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/22 15:56:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 16:25:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { runParticle } from "../../../../games/particles/particleAnimation.js";

let cleanupFn: (() => void) | null = null;

export async function setupParticles() {
    cleanupFn = runParticle("#layout-landing-hero-canvas");
}

export function teardownParticles(ctx?: { keepCanvas?: boolean }) {
    const nextIsApp =
        window.location.pathname.startsWith("/dashboard") ||
        window.location.pathname.startsWith("/settings") ||
        window.location.pathname.startsWith("/pong");

    if (nextIsApp || ctx?.keepCanvas === false) {
        cleanupFn?.();
    }
    cleanupFn = null;
}

