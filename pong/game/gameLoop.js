// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   gameLoop.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/06 17:58:19 by jeportie          #+#    #+#             //
//   Updated: 2025/08/06 18:03:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import drawBG from "./drawBG.js"

export function gameLoop(paddle, ball, draw, canvas) {

    drawBG(draw, canvas);

    paddle.update();
    paddle.draw();
    ball.update(paddle);
    ball.draw();

    requestAnimationFrame(() => gameLoop(paddle, ball, draw, canvas));
}
