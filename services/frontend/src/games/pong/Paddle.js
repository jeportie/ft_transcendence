// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Paddle.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:23:11 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:27:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Rect from "../lib2D/Rect.js";
import { clamp } from "../lib2D/utils.js";

/**
 * Simple vertical paddle (extends Rect).
 * Reads input via a provided keyboard + keys.
 */
export default class Paddle extends Rect {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Object} opts
     * @param {number} [opts.speed=360] - pixels per second
     * @param {Keyboard} [opts.keyboard] - keyboard helper
     * @param {string} [opts.keyUp="ArrowUp"]
     * @param {string} [opts.keyDown="ArrowDown"]
     * @param {number} [opts.canvasHeight] - for clamping
     * @param {string} [opts.color="#fff"]
     */
    constructor(x, y, w, h, { speed = 360, keyboard = null, keyUp = "ArrowUp", keyDown = "ArrowDown",
        canvasHeight = null, color = "#fff", } = {}) {
        super(x, y, w, h);
        this.speed = speed;
        this.keyboard = keyboard;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.canvasHeight = canvasHeight;
        this.color = color;
        this.moveDir = 0; // -1 up, +1 down, 0 idle (useful to influence ball bounce)
    }

    update(dt) {
        // manual velocity: up/down keys
        let dy = 0;
        if (this.keyboard?.isDown(this.keyUp)) dy -= 1;
        if (this.keyboard?.isDown(this.keyDown)) dy += 1;
        this.moveDir = dy;
        this.pos.y += dy * this.speed * dt;

        if (this.canvasHeight != null) {
            this.pos.y = clamp(this.pos.y, 0, this.canvasHeight - this.h);
        }
    }

    render(ctx) {
        super.render(ctx, { fill: this.color });
    }
}
