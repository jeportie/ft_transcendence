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

import Ball from "./Ball.class.js";
import Paddle from "./Paddle.class.js";
import Position from "./Position.class.js";
import Vector from "./Vector2D.class.js";
import Draw2D from "./Draw2D.class.js";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext('2d');
const draw = new Draw2D(ctx);

const speed = 4.123;
const angleRad = 1.5708;
const velocity = new Vector(1, 0).rotate(angleRad).scale(speed);
const startPosition = new Position(canvas.width / 2, canvas.height / 2);
const paddlePos = new Position(5, canvas.height / 2);
const ball = new Ball(startPosition, velocity, 10, canvas, draw);
const paddle = new Paddle(paddlePos, canvas, draw);

// Main loop
function gameLoop() {
    // Clear
    draw.rect(0, 0, canvas.width, canvas.height, { fillStyle: "#000000" });

    // draw center dashed line
    draw.line(
        canvas.width / 2, 0,
        canvas.width / 2, canvas.height,
        { strokeStyle: "#555555", lineWidth: 4, dash: [10, 10] }
    );

    paddle.update();
    paddle.draw();

    // Update & draw
    ball.update();
    ball.draw();

    requestAnimationFrame(gameLoop);
}


gameLoop();
