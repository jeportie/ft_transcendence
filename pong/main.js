// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 17:53:15 by jeportie          #+#    #+#             //
//   Updated: 2025/08/05 19:04:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Ball from "./class/Ball.js";
import Paddle from "./class/Paddle.js";
import Position from "./class/Position.js";
import Vector from "./class/Vector.js";
import Draw2D from "./class/Draw2D.js";


function drawBackground(draw, canvas) {

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

// Main loop
function gameLoop(paddle, ball, draw, canvas) {

    drawBackground(draw, canvas);

    paddle.update();
    paddle.draw();
    ball.update(paddle);
    ball.draw();

    requestAnimationFrame(() => gameLoop(paddle, ball, draw, canvas));
}

function main() {
    const canvas = document.querySelector("#gameCanvas");
    const ctx = canvas.getContext('2d');
    const draw = new Draw2D(ctx);

    const speed = 4;
    const angleRad = 3.09;
    const velocity = new Vector(1, 0).rotate(angleRad).scale(speed);
    const startPosition = new Position(canvas.width / 2, canvas.height / 2);
    const paddlePos = new Position(5, canvas.height / 2);

    const ball = new Ball(startPosition, velocity, 10, canvas, draw);
    const paddle = new Paddle(paddlePos, canvas, draw);

    gameLoop(paddle, ball, draw, canvas);
}

main();
