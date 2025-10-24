// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   displacementMap.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 13:00:23 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 13:00:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { createImageDataBrowser } from "./magnifyingDisplacement";

export function calculateDisplacementMap(
    glassThickness = 200,
    bezelWidth = 50,
    bezelHeightFn: (x: number) => number = (x) => x,
    refractiveIndex = 1.5,
    samples = 128
): number[] {
    const eta = 1 / refractiveIndex;

    function refract(normalX: number, normalY: number): [number, number] | null {
        const dot = normalY;
        const k = 1 - eta * eta * (1 - dot * dot);
        if (k < 0) return null;
        const kSqrt = Math.sqrt(k);
        return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY];
    }

    return Array.from({ length: samples }, (_, i) => {
        const x = i / samples;
        const y = bezelHeightFn(x);

        const dx = 0.0001;
        const y2 = bezelHeightFn(x + dx);
        const derivative = (y2 - y) / dx;
        const magnitude = Math.sqrt(derivative * derivative + 1);
        const normal = [-derivative / magnitude, -1 / magnitude];
        const refracted = refract(normal[0], normal[1]);
        if (!refracted) return 0;

        const remainingHeight = y * bezelWidth + glassThickness;
        return refracted[0] * (remainingHeight / refracted[1]);
    });
}

export function calculateDisplacementMap2(
    canvasWidth: number,
    canvasHeight: number,
    objectWidth: number,
    objectHeight: number,
    radius: number,
    bezelWidth: number,
    maximumDisplacement: number,
    precomputedDisplacementMap: number[] = [],
    dpr?: number
): ImageData {
    const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
    const bufferWidth = Math.floor(canvasWidth * devicePixelRatio);
    const bufferHeight = Math.floor(canvasHeight * devicePixelRatio);
    const imageData = createImageDataBrowser(bufferWidth, bufferHeight);

    const radius_ = radius * devicePixelRatio;
    const bezel = bezelWidth * devicePixelRatio;
    const radiusSq = radius_ ** 2;
    const outerSq = (radius_ + 1) ** 2;
    const innerSq = (radius_ - bezel) ** 2;

    const widthBetween = objectWidth * devicePixelRatio - radius_ * 2;
    const heightBetween = objectHeight * devicePixelRatio - radius_ * 2;
    const objectX = (bufferWidth - objectWidth * devicePixelRatio) / 2;
    const objectY = (bufferHeight - objectHeight * devicePixelRatio) / 2;

    const data = imageData.data;

    for (let y1 = 0; y1 < objectHeight * devicePixelRatio; y1++) {
        for (let x1 = 0; x1 < objectWidth * devicePixelRatio; x1++) {
            const idx = ((objectY + y1) * bufferWidth + objectX + x1) * 4;

            const x = x1 < radius_
                ? x1 - radius_
                : x1 >= objectWidth * devicePixelRatio - radius_
                    ? x1 - (objectWidth * devicePixelRatio - radius_)
                    : 0;
            const y = y1 < radius_
                ? y1 - radius_
                : y1 >= objectHeight * devicePixelRatio - radius_
                    ? y1 - (objectHeight * devicePixelRatio - radius_)
                    : 0;

            const distSq = x * x + y * y;
            if (distSq > outerSq || distSq < innerSq) continue;

            const dist = Math.sqrt(distSq);
            const distFromSide = radius_ - dist;
            const cos = x / dist;
            const sin = y / dist;

            const bezelIndex = Math.floor((distFromSide / bezel) * precomputedDisplacementMap.length);
            const distance = precomputedDisplacementMap[bezelIndex] ?? 0;
            const dX = (-cos * distance) / maximumDisplacement;
            const dY = (-sin * distance) / maximumDisplacement;

            data[idx] = 128 + dX * 127;
            data[idx + 1] = 128 + dY * 127;
            data[idx + 2] = 0;
            data[idx + 3] = 255;
        }
    }

    return imageData;
}

