// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Rect.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:29:46 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:42:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractEntity from "./AbstractEntity.js";

/**
 * Axis-aligned rectangle entity, anchored at top-left (pos.x, pos.y).
 */
export default class Rect extends AbstractEntity {
    /**
     * @param {number} x - Top-left X.
     * @param {number} y - Top-left Y.
     * @param {number} w - Width.
     * @param {number} h - Height.
     */
    constructor(x, y, w, h) {
        super(x, y);
    /** @type {number} */ this.w = w;
    /** @type {number} */ this.h = h;
    }

    /**
     * Render the rectangle.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string|null} [options.fill="#fff"]
     * @param {string|null} [options.stroke=null]
     * @param {number} [options.lineWidth=1]
     * @returns {void}
     */
    render(ctx, { fill = "#fff", stroke = null, lineWidth = 1 } = {}) {
        if (fill) { ctx.fillStyle = fill; ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h); }
    }

    /**
     * Point-in-rect test.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    contains(x, y) {
        return (
            x >= this.pos.x &&
            x <= this.pos.x + this.w &&
            y >= this.pos.y &&
            y <= this.pos.y + this.h
        );
    }
}
