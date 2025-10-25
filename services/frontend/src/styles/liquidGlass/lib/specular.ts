// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   specular.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 11:56:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { createImageDataBrowser } from "./magnifyingDisplacement";

export function calculateRefractionSpecular(
    objectWidth: number,
    objectHeight: number,
    radius: number,
    bezelWidth: number,
    specularAngle = Math.PI / 3,
    dpr?: number
): ImageData {
    const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
    const bufferWidth = Math.floor(objectWidth * devicePixelRatio);
    const bufferHeight = Math.floor(objectHeight * devicePixelRatio);
    const imageData = createImageDataBrowser(bufferWidth, bufferHeight);
    const data = imageData.data;

    // --- Center coordinates (💥 fix)
    const cx = bufferWidth / 2;
    const cy = bufferHeight / 2;

    const radius_ = radius * devicePixelRatio;
    const bezel_ = bezelWidth * devicePixelRatio;
    const radiusSq = radius_ ** 2;
    const outerSq = (radius_ + devicePixelRatio) ** 2;
    const innerSq = (radius_ - bezel_) ** 2;

    // Direction of the virtual light source
    const specularVec = [Math.cos(specularAngle), Math.sin(specularAngle)];

    for (let y = 0; y < bufferHeight; y++) {
        for (let x = 0; x < bufferWidth; x++) {
            const idx = (y * bufferWidth + x) * 4;

            // Centered coordinates
            const dx = x - cx;
            const dy = y - cy;
            const distSq = dx * dx + dy * dy;
            if (distSq < innerSq || distSq > outerSq) continue;

            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist; // no inversion now

            // Specular coefficient based on light direction
            const dot = Math.max(0, nx * specularVec[0] + ny * specularVec[1]);
            const edge = Math.max(0, 1 - (radius_ - dist) / bezel_);
            const intensity = dot * Math.sqrt(1 - (1 - edge) ** 2);

            const color = Math.min(255, intensity * 255);
            data[idx] = color;
            data[idx + 1] = color;
            data[idx + 2] = color;
            data[idx + 3] = Math.round(color);
        }
    }

    return imageData;
}

