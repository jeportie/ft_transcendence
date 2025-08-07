// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Vector.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:25:36 by jeportie          #+#    #+#             //
//   Updated: 2025/08/07 15:03:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default class Vector extends Coord {

    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    normalize() {
        const mag = this.magnitude || 1;
        return new Vector(this.x / mag, this.y / mag);
    }

    invertY() {
        return new Vector(this.x, -this.y);
    }

    invertX() {
        return new Vector(-this.x, this.y);
    }

    rotate(angleRad) {
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    withMagnitude(newMag) {
        return this.normalize().scale(newMag);
    }
}
