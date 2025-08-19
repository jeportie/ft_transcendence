// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/06 18:08:29 by jeportie          #+#    #+#             //
//   Updated: 2025/08/06 18:13:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

import Position from "../lib2D/Position.js";
import Vector from "../lib2D/Vector.js";
import Draw2D from "../lib2D/Draw2D.js";

import gameLoop from "./gameLoop.js"

export default function runGame() {
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

