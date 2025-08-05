// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Paddle.class.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/05 18:25:13 by jeportie          #+#    #+#             //
//   Updated: 2025/08/05 19:07:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default class Paddle {

    constructor(position, canvas, drawer) {
        this.position = position;
        this.canvas = canvas;
        this.drawer = drawer;

        // movement state
        this.speedY = 0;      // current vertical speed
        this.maxSpeed = 6;      // top speed
        this.acceleration = 0.3;    // how fast we speed up
        this.friction = 0.2;    // how fast we slow down when no key
        this.height = 50;     // paddle height (match your draw call)

        // which keys are held?
        this.upPressed = false;
        this.downPressed = false;

        // listen for keys
        window.addEventListener('keydown', event => this._onKeyDown(event));
        window.addEventListener('keyup', event => this._onKeyUp(event));
    }

    _onKeyDown(event) {
        if (event.key === 'ArrowUp') this.upPressed = true;
        if (event.key === 'ArrowDown') this.downPressed = true;
    }

    _onKeyUp(event) {
        if (event.key === 'ArrowUp') this.upPressed = false;
        if (event.key === 'ArrowDown') this.downPressed = false;
    }

    update() {
        // accelerate
        if (this.upPressed && !this.downPressed) {
            this.speedY = Math.max(this.speedY - this.acceleration, -this.maxSpeed);
        }
        else if (this.downPressed && !this.upPressed) {
            this.speedY = Math.min(this.speedY + this.acceleration, this.maxSpeed);
        }
        else {
            // apply friction toward zero
            if (this.speedY > 0) this.speedY = Math.max(this.speedY - this.friction, 0);
            if (this.speedY < 0) this.speedY = Math.min(this.speedY + this.friction, 0);
        }

        // move paddle
        this.position.y += this.speedY;

        // clamp inside canvas
        this.position.y = Math.max(
            0,
            Math.min(this.position.y, this.canvas.height - this.height)
        );
    }

    draw() {
        this.drawer.rect(
            this.position.x,
            this.position.y,
            10,
            50,
            {
                fillStyle: "#FFFFFF",
                strokeStyle: "#555555",
                lineWidth: 3
            }
        );
    }
}
