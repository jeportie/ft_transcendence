// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AbstractEntity.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:25:54 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:28:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Point from "./Point.js";
import Vector from "./Vector.js";

/**
 * Minimal base for “things that move and render”.
 * Uses composition: a position Point and a velocity Vector.
 */
export default class AbstractEntity {
    /**
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     */
    constructor(x = 0, y = 0) {
        /** @type {Point} World position of the entity. */
        this.pos = new Point(x, y);
        /** @type {Vector} Velocity in pixels per second. */
        this.vel = new Vector(0, 0);
        /** @type {boolean} Whether the entity should update/render. */
        this.alive = true;
    }

    /**
     * Move by velocity * dt.
     * @param {number} dt - Delta time (seconds).
     * @returns {void}
     */
    update(dt) {
        this.pos.move(this.vel, dt);
    }

    /**
     * Render the entity. Override in subclasses.
     * @param {CanvasRenderingContext2D} _ctx
     * @returns {void}
     */
    render(_ctx) { }

    /**
     * Reflect velocity on axis with optional deflection angle (radians).
     * @param {"x"|"y"} axis
     * @param {number} [angle=0]
     * @returns {void}
     */
    bounce(axis, angle = 0) {
        this.vel = this.vel.reflect(axis, angle);
    }

    /**
     * Draws a tiny velocity arrow for debugging.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string} [options.color="#0ff"]
     * @returns {void}
     */
    renderVelocity(ctx, { color = "#0ff" } = {}) {
        this.vel.render(ctx, { ox: this.pos.x, oy: this.pos.y, color, lineWidth: 1, headSize: 6 });
    }
}
