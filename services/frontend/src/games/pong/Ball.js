// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Ball.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:30:07 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:30:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Circle, Rect, Vector, collision, deg2rad } from "@jeportie/lib2d";
const { collideCircleRect } = collision;

/**
 * Pong ball with simple serve + paddle/canvas bounce.
 */
export default class Ball extends Circle {
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} r
     * @param {Object} opts
     * @param {number} [opts.speed=380] - pixels per second
     * @param {number} [opts.serveAngleSpreadDeg=20] - random spread around straight line
     * @param {string} [opts.color="#25AEEE"]
     */
    constructor(cx, cy, r, { speed = 380, serveAngleSpreadDeg = 20, color = "#25AEEE" } = {}) {
        super(cx, cy, r);
        this.baseSpeed = speed;
        this.serveSpread = deg2rad(serveAngleSpreadDeg);
        this.color = color;
    }

    /**
     * Serve the ball toward left (-1) or right (+1).
     * @param {number} dir -1 or +1
     */
    serve(dir = 1) {
        const spread = (Math.random() * this.serveSpread) - this.serveSpread / 2;
        const angle = (dir > 0 ? 0 : Math.PI) + spread;
        const vx = Math.cos(angle) * this.baseSpeed;
        const vy = Math.sin(angle) * this.baseSpeed;
        this.vel = new Vector(vx, vy);
    }

    /**
     * Bounce on top/bottom walls.
     * @param {number} width
     * @param {number} height
     */
    bounceCanvas(width, height) {
        if (this.pos.y - this.r <= 0) {
            this.pos.y = this.r;
            this.vel = this.vel.reflect("y");
        } else if (this.pos.y + this.r >= height) {
            this.pos.y = height - this.r;
            this.vel = this.vel.reflect("y");
        }
    }

    /**
     * Try bounce against a paddle (Rect). Adds a small angle based on paddle moveDir.
     * @param {Rect} paddle
     * @param {number} deflectDeg - small extra deflection
     */
    bouncePaddle(paddle, deflectDeg = 12) {
        const hit = collideCircleRect(
            { x: this.pos.x, y: this.pos.y, r: this.r },
            { x: paddle.pos.x, y: paddle.pos.y, w: paddle.w, h: paddle.h }
        );

        if (!hit.collides) return false;

        // 1) separate along normal
        this.pos.x += hit.normal.x * hit.penetration;
        this.pos.y += hit.normal.y * hit.penetration;

        // 2) reflect; add tiny angle based on paddle movement (up/down)
        const tweak = deg2rad(deflectDeg) * (paddle.moveDir || 0);
        if (Math.abs(hit.normal.x) > Math.abs(hit.normal.y)) {
            // hit on left/right face -> reflect X
            this.vel = this.vel.reflect("x", tweak);
        } else {
            // rare case: hitting top/bottom edge -> reflect Y
            this.vel = this.vel.reflect("y", tweak);
        }

        return true;
    }

    render(ctx) {
        super.render(ctx, { fill: this.color });
    }
}
