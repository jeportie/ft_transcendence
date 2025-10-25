// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   magnifyingDisplacement.ts                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:50:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 17:45:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function createImageDataBrowser(width: number, height: number): ImageData {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    return ctx.createImageData(width, height);
}

/**
 * Creates a centered symmetric magnifying displacement map.
 */
export function calculateMagnifyingDisplacementMap(
    canvasWidth: number,
    canvasHeight: number
): ImageData {
    const dpr = window.devicePixelRatio ?? 1;
    const bufferWidth = Math.floor(canvasWidth * dpr);
    const bufferHeight = Math.floor(canvasHeight * dpr);
    const imageData = createImageDataBrowser(bufferWidth, bufferHeight);

    const cx = bufferWidth / 2;
    const cy = bufferHeight / 2;
    const sx = bufferWidth / 2;
    const sy = bufferHeight / 2;
    const data = imageData.data;

    for (let y = 0; y < bufferHeight; y++) {
        for (let x = 0; x < bufferWidth; x++) {
            const idx = (y * bufferWidth + x) * 4;
            const rX = (x - cx) / sx;
            const rY = (y - cy) / sy;
            data[idx] = 128 - rX * 127;
            data[idx + 1] = 128 - rY * 127;
            data[idx + 2] = 0;
            data[idx + 3] = 255;
        }
    }
    return imageData;
}

