// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Ball.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:09:27 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 19:23:29 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default class Ball {

    constructor(position, velocity, radius, canvas, drawer) {
        this.position = position;   // Position instance
        this.velocity = velocity;   // Vector2D instance
        this.radius = radius;
        this.canvas = canvas;
        this.drawer = drawer;
    }

    update(leftPaddle) {
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
        // Bounce off right
        if (this.position.x + this.radius > this.canvas.width) {
            this.position.x = this.canvas.width - this.radius;
            this.velocity = this.velocity.invertX();
        }
        // Bounce off paddle
        this.isOnPaddle(leftPaddle);
    }

    isOnPaddle(paddle) {
        // Closest point on the paddle rectangle to the ball centre
        const closestX = Math.max(
            paddle.position.x,
            Math.min(this.position.x, paddle.position.x + paddle.height)
        );
        const closestY = Math.max(
            paddle.position.y,
            Math.min(this.position.y, paddle.position.y + paddle.width)
        );

        // Vector from closest point to ball centre
        const dx = this.position.x - closestX;
        const dy = this.position.y - closestY;
        const distSq = dx * dx + dy * dy;

        // If inside or touching the ball
        if (distSq <= this.radius * this.radius) {
            // Only bounce once per collision (prevent sticking)
            if (this.velocity.x < 0) {            // moving toward the paddle
                this.velocity = this.velocity.invertX();
            }
        }
    }

    draw() {
        this.drawer.circle(
            this.position.x,
            this.position.y,
            this.radius,
            { fillStyle: "#FFFFFF", strokeStyle: "#555555", lineWidth: 3 }
        );
    }
}
