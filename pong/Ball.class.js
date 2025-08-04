// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Ball.class.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:09:27 by jeportie          #+#    #+#             //
//   Updated: 2025/08/04 18:35:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Position from "./Position.class.js";
import Vector from "./Vector2D.class.js";

// Ball class now uses Position and Vector2D
export default class Ball {

	constructor(position, velocity, radius, canvas, ctx) {
		this.position = position;   // Position instance
		this.velocity = velocity;   // Vector2D instance
		this.radius = radius;
		this.canvas = canvas;
		this.ctx = ctx;
	}

	update() {
		// Move!
		this.position.translate(this.velocity);

		// Bounce off top
		if (this.position.y - this.radius < 0) {
			this.position.y = this.radius;
			this.velocity = this.velocity.invertY();
		}
		// Bounce off bottom
		if (this.position.y + this.radius > this.canvas.height) {
			this.position.y = this.canvas.height - this.radius;
			this.velocity = this.velocity.invertY();
		}
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.arc(
			this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2
		);
		this.ctx.fillStyle = '#FFF';
		this.ctx.fill();
		this.ctx.closePath();
	}
};
