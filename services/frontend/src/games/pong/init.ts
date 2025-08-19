// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/06 18:08:29 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 20:05:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// services/frontend/src/pong/init.js
import Ball from "./Ball.ts";
import Paddle from "./Paddle.ts";
import Position from "../lib2D/Position.ts";
import Vector from "../lib2D/Coord.ts";
import Draw2D from "../lib2D/Draw2D.ts";
import drawBG from "./drawBG.ts";

export default function createPong(canvas) {
    const ctx = canvas.getContext("2d");
    const draw = new Draw2D(ctx);

    const speed = 4;
    const angleRad = 3.09;
    const velocity = new Vector(1, 0).rotate(angleRad).scale(speed);
    const startPosition = new Position(canvas.width / 2, canvas.height / 2);
    const paddlePos = new Position(5, canvas.height / 2);

    const ball = new Ball(startPosition, velocity, 10, canvas, draw);
    const paddle = new Paddle(paddlePos, canvas, draw);

    let running = false;
    let rafId = 0;

    const loop = () => {
        if (!running) return;
        // draw frame
        drawBG(draw, canvas);
        paddle.update();
        paddle.draw();
        ball.update(paddle);
        ball.draw();
        rafId = requestAnimationFrame(loop);
    };

    function start() {
        if (running) return;
        running = true;
        rafId = requestAnimationFrame(loop);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    function dispose() {
        stop();
        paddle.destroy(); // remove key listeners
    }

    return { start, stop, dispose };
}

