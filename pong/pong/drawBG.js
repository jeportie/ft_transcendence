// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   drawBG.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/06 18:01:49 by jeportie          #+#    #+#             //
//   Updated: 2025/08/06 18:07:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default function drawBackground(draw, canvas) {

    draw.rect(
        0,
        0,
        canvas.width,
        canvas.height,
        { fillStyle: "#000000" });

    draw.line(
        canvas.width / 2,
        0,
        canvas.width / 2,
        canvas.height,
        { strokeStyle: "#555555", lineWidth: 4, dash: [10, 10] }
    );
}
