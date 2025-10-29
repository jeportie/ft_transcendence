
// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   specular.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 18:40:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { createImageDataBrowser } from "./magnifyingDisplacement";

/**
 * Generates a thin specular ring *around the lens edge*, centered and symmetric.
 * The highlight direction is controlled by `specularAngle`.
 */
export function calculateRefractionSpecular(
    objectWidth: number,
    objectHeight: number,
    radius: number,
    bezelWidth: number,
    specularAngle = Math.PI / 3,
    dpr?: number
): ImageData {
    const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
    const W = Math.floor(objectWidth * devicePixelRatio);
    const H = Math.floor(objectHeight * devicePixelRatio);
    const img = createImageDataBrowser(W, H);
    const data = img.data;

    const cx = W / 2;
    const cy = H / 2;

    const r = radius * devicePixelRatio;
    const b = bezelWidth * devicePixelRatio;

    // Ring confines (slightly outside and inside the geometric edge)
    const innerSq = Math.max(0, (r - b * 0.45) ** 2);
    const outerSq = (r + 0.75 * devicePixelRatio) ** 2;

    const lx = Math.cos(specularAngle);
    const ly = Math.sin(specularAngle);

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;

            const dx = x - cx;
            const dy = y - cy;
            const d2 = dx * dx + dy * dy;
            if (d2 < innerSq || d2 > outerSq) continue;

            const d = Math.sqrt(d2);
            const nx = dx / d;      // outward normal
            const ny = dy / d;

            // light alignment
            const ndotl = Math.max(0, nx * lx + ny * ly);

            // distance into ring [0..1] (1 at outer rim)
            const t = Math.min(1, Math.max(0, (d - (r - b * 0.45)) / (b * 0.45 + 0.75)));
            // gentle rim falloff
            const rim = Math.sqrt(1 - (1 - t) * (1 - t)); // smooth-ish

            const intensity = ndotl * rim;
            if (intensity <= 0) continue;

            const c = Math.round(255 * intensity);
            const a = Math.round(200 * intensity); // softer alpha than color

            data[i] = c;
            data[i + 1] = c;
            data[i + 2] = c;
            data[i + 3] = a;
        }
    }
    return img;
}

