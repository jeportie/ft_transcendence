// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Line.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:31:01 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:31:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractEntity from "./AbstractEntity.js";
import Point from "./Point.js";

/**
 * Line segment entity defined by two points (relative to its own movement).
 * Its velocity moves both endpoints together.
 */
export default class Line extends AbstractEntity {
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    constructor(x1, y1, x2, y2) {
        super(0, 0); // we ignore pos for endpoints; we move endpoints directly
    /** @type {Point} */ this.a = new Point(x1, y1);
    /** @type {Point} */ this.b = new Point(x2, y2);
    }

    /**
     * Move endpoints by velocity * dt.
     * @param {number} dt
     * @returns {void}
     */
    update(dt) {
        this.a.move(this.vel, dt);
        this.b.move(this.vel, dt);
    }

    /**
     * Render the line segment.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string} [options.color="#fff"]
     * @param {number} [options.lineWidth=2]
     * @param {number[]} [options.dash=[]]
     * @returns {void}
     */
    render(ctx, { color = "#fff", lineWidth = 2, dash = [] } = {}) {
        ctx.beginPath();
        if (dash.length) ctx.setLineDash(dash);
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (dash.length) ctx.setLineDash([]);
        ctx.closePath();
    }

    /**
     * Distance from a point to this segment (useful for simple hit tests).
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distanceToPoint(x, y) {
        // project point onto segment AB and clamp
        const vx = this.b.x - this.a.x;
        const vy = this.b.y - this.a.y;
        const wx = x - this.a.x;
        const wy = y - this.a.y;
        const len2 = vx * vx + vy * vy || 1;
        const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
        const px = this.a.x + t * vx;
        const py = this.a.y + t * vy;
        const dx = x - px, dy = y - py;
        return Math.hypot(dx, dy);
    }
}
