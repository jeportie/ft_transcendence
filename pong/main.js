// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 17:53:15 by jeportie          #+#    #+#             //
//   Updated: 2025/08/04 18:36:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Ball from "./Ball.class.js";
import Position from "./Position.class.js";
import Vector from "./Vector2D.class.js";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext('2d');

// Create a random‐direction velocity vector of fixed speed
const speed = 5;
const angleRad = 1.5708;
const velocity = new Vector(1, 0)      // unit vector along +x
	.rotate(angleRad)                     // spin it to a random angle
	.scale(speed);                        // bump it out to 'speed' length

// Centered starting position
const startPosition = new Position(canvas.width / 2, canvas.height / 2);

// Put it all together
const ball = new Ball(startPosition, velocity, 10, canvas, ctx);

// Main loop
function gameLoop() {
	// Clear
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Update & draw
	ball.update();
	ball.draw();

	requestAnimationFrame(gameLoop);
}

gameLoop();
