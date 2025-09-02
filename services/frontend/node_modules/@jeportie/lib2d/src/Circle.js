// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Circle.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:28:28 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:29:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractEntity from "./AbstractEntity.js";

/**
 * Simple circle entity (centered at pos).
 */
export default class Circle extends AbstractEntity {
    /**
     * @param {number} x - Center X.
     * @param {number} y - Center Y.
     * @param {number} r - Radius.
     */
    constructor(x, y, r) {
        super(x, y);
        /** @type {number} */
        this.r = r;
    }

    /**
     * Render the circle.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string|null} [options.fill="#fff"]
     * @param {string|null} [options.stroke=null]
     * @param {number} [options.lineWidth=1]
     * @returns {void}
     */
    render(ctx, { fill = "#fff", stroke = null, lineWidth = 1 } = {}) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.closePath();
    }

    /**
     * Point-in-circle test.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    contains(x, y) {
        const dx = x - this.pos.x, dy = y - this.pos.y;
        return dx * dx + dy * dy <= this.r * this.r;
    }
}
