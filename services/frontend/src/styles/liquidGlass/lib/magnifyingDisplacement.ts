// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   magnifyingDisplacement.ts                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:51:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:59:10 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function createImageDataBrowser(width: number, height: number): ImageData {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    return ctx.createImageData(width, height);
}

export function calculateMagnifyingDisplacementMap(canvasWidth: number, canvasHeight: number): ImageData {
    const dpr = window.devicePixelRatio ?? 1;
    const bufferWidth = Math.floor(canvasWidth * dpr);
    const bufferHeight = Math.floor(canvasHeight * dpr);
    const imageData = createImageDataBrowser(bufferWidth, bufferHeight);

    const ratio = Math.max(bufferWidth / 2, bufferHeight / 2);

    for (let y = 0; y < bufferHeight; y++) {
        for (let x = 0; x < bufferWidth; x++) {
            const idx = (y * bufferWidth + x) * 4;

            const rX = (x - bufferWidth / 2) / ratio;
            const rY = (y - bufferHeight / 2) / ratio;

            imageData.data[idx] = 128 - rX * 127;      // R
            imageData.data[idx + 1] = 128 - rY * 127;  // G
            imageData.data[idx + 2] = 0;               // B
            imageData.data[idx + 3] = 255;             // A
        }
    }
    return imageData;
}

