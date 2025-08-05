// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Ball.class.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:09:27 by jeportie          #+#    #+#             //
//   Updated: 2025/08/05 19:07:38 by jeportie         ###   ########.fr       //
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
        this.drawer.circle(
            this.position.x,
            this.position.y,
            this.radius,
            { fillStyle: "#FFFFFF", strokeStyle: "#555555", lineWidth: 3 }
        );
    }
}
