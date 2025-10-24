// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   generateFunctionPath.ts                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:07:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:08:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { CONCAVE, CONVEX, CONVEX_CIRCLE, LIP } from "../lib/surfaceEquations";

/**
 * Generate an SVG path for a mathematical function.
 */
export function generateFunctionPath(
    fn: (x: number) => number,
    options?: { size?: number; pad?: number; samples?: number }
): string {
    const size = options?.size ?? 24;
    const pad = options?.pad ?? Math.max(1, Math.floor(size / 12));
    const samples = options?.samples ?? Math.max(24, Math.floor(size * 2));
    const w = size;
    const h = size;
    let d = "";

    for (let i = 0; i <= samples; i++) {
        const x = i / samples;
        const y = Math.max(0, Math.min(1, fn(x))); // clamp
        const px = pad + x * (w - pad * 2);
        const py = h - (pad + y * (h - pad * 2));
        d += `${i === 0 ? "M" : " L"} ${px.toFixed(2)} ${py.toFixed(2)}`;
    }

    return d;
}

// Pre-generated icons for 24px buttons
export const ConvexCirclePath24 = generateFunctionPath(CONVEX_CIRCLE.fn, { size: 24, pad: 3 });
export const ConvexPath24 = generateFunctionPath(CONVEX.fn, { size: 24, pad: 3 });
export const ConcavePath24 = generateFunctionPath(CONCAVE.fn, { size: 24, pad: 3 });
export const LipPath24 = generateFunctionPath(LIP.fn, { size: 24, pad: 3 });
