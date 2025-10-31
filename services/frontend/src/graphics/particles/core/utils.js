// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   utils.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 10:14:58 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:40:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t;

// deterministic PRNG (Mulberry32)
export function mulberry32(seed) {
    return function() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
// alias for clarity inside engine.js
export function seededRand(seed = 1) {
    return mulberry32(seed >>> 0);
}

export function hexToRgb(hex) {
    if (typeof hex !== "string" || !hex.startsWith("#")) {
        // fallback color if input invalid
        return { r: 147, g: 197, b: 253 }; // sky-300
    }
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToCss({ r, g, b }, a = 1) {
    return a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}
