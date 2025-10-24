// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   imageDataToUrl.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:51:38 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:58:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function imageDataToUrl(imageData: ImageData): string {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

