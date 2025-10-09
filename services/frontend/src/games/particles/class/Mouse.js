// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Mouse.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:12:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 10:56:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Point } from "@jeportie/lib2d";
import { lerp } from "../core/utils.js";

export default class Mouse {
    constructor() {
        this.pos = new Point(0, 0);
        this.prev = new Point(0, 0);
        this.has = false;       // whether mouse is over canvas
        this.speed = 0;         // smoothed pixel/frame motion
        this.fade = 0;          // fade factor [0..1] used for glow
    }

    /**
     * Called every frame to smooth speed & fade transitions.
     */
    update() {
        const dx = this.pos.x - this.prev.x;
        const dy = this.pos.y - this.prev.y;
        const dist = Math.hypot(dx, dy);

        // Smooth motion speed
        this.speed = lerp(this.speed, dist, 0.3);

        // Remember position for next frame
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;

        // Ease in/out fade when entering/leaving canvas
        const target = this.has ? 1 : 0;
        this.fade = lerp(this.fade, target, 0.02);
    }

    /**
     * Called by canvas mousemove handler.
     */
    move(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.has = true;
    }

    /**
     * Called by mouseleave handler.
     */
    leave() {
        this.has = false;
    }
}
