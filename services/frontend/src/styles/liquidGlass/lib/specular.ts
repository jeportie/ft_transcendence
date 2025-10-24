// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   specular.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:59:53 by jeportie         ###   ########.fr       //
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

    const radius_ = radius * devicePixelRatio;
    const bezel_ = bezelWidth * devicePixelRatio;

    const specularVec = [Math.cos(specularAngle), Math.sin(specularAngle)];
    const radiusSq = radius_ ** 2;
    const outerSq = (radius_ + devicePixelRatio) ** 2;
    const innerSq = (radius_ - bezel_) ** 2;

    const widthBetween = bufferWidth - radius_ * 2;
    const heightBetween = bufferHeight - radius_ * 2;

    const data = imageData.data;

    for (let y1 = 0; y1 < bufferHeight; y1++) {
        for (let x1 = 0; x1 < bufferWidth; x1++) {
            const idx = (y1 * bufferWidth + x1) * 4;

            const isEdgeX = x1 < radius_ || x1 >= bufferWidth - radius_;
            const isEdgeY = y1 < radius_ || y1 >= bufferHeight - radius_;
            if (!(isEdgeX || isEdgeY)) continue;

            const x = x1 < radius_ ? x1 - radius_ : x1 - (bufferWidth - radius_);
            const y = y1 < radius_ ? y1 - radius_ : y1 - (bufferHeight - radius_);

            const distSq = x * x + y * y;
            if (distSq < innerSq || distSq > outerSq) continue;

            const dist = Math.sqrt(distSq);
            const nx = x / dist;
            const ny = -y / dist;
            const dot = Math.abs(nx * specularVec[0] + ny * specularVec[1]);
            const coef = dot * Math.sqrt(1 - (1 - (radius_ - dist) / bezel_) ** 2);

            const color = Math.min(255, 255 * coef);
            data[idx] = color;
            data[idx + 1] = color;
            data[idx + 2] = color;
            data[idx + 3] = 255 * coef;
        }
    }
    return imageData;
}

