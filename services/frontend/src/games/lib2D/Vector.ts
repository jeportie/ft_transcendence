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

import Coord from "./Coord.js"

/**
 * Represents a 2D vector with magnitude and direction, extending Coord.
 * @extends Coord
 */
export default class Vector extends Coord {

    /**
     * Factory: create a Vector from raw x,y.
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    static from(x, y) {
        return new Vector(x, y);
    }

    /**
     * Gets the magnitude (length) of the vector.
     * @type {number}
     */
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Returns a new normalized (unit length) vector in the same direction.
     * @returns {Vector} A new Vector with magnitude 1 (or zero vector if original is zero).
     */
    normalize() {
        const mag = this.magnitude || 1;
        return new Vector(this.x / mag, this.y / mag);
    }

    /**
     * Returns a new vector with its Y component inverted.
     * @returns {Vector} A new Vector reflected over the X-axis.
     */
    invertY() {
        return new Vector(this.x, -this.y);
    }

    /**
     * Returns a new vector with its X component inverted.
     * @returns {Vector} A new Vector reflected over the Y-axis.
     */
    invertX() {
        return new Vector(-this.x, this.y);
    }

    /**
     * Rotates the vector by a given angle around the origin.
     * @param {number} angleRad - The rotation angle in radians.
     * @returns {Vector} A new Vector representing the rotated vector.
     */
    rotate(angleRad) {
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Returns a new vector with the same direction but a different magnitude.
     * @param {number} newMag - The desired magnitude for the new vector.
     * @returns {Vector} A new Vector scaled to the specified magnitude.
     */
    withMagnitude(newMag) {
        return this.normalize().scale(newMag);
    }

    /**
     * Computes the dot product between this vector and another.
     * @param {Vector} other - The other vector.
     * @returns {number} The scalar dot product (this · other).
     */
    dot(other) {
        if (!(other instanceof Vector)) {
            throw new TypeError("Vector.dot requires a Vector");
        }
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Computes the 2D cross product (scalar) between this vector and another.
     * @param {Vector} other - The other vector.
     * @returns {number} The scalar cross product (this × other) in 2D.
     */
    cross(other) {
        if (!(other instanceof Vector)) {
            throw new TypeError("Vector.cross requires a Vector");
        }
        return this.x * other.y - this.y * other.x;
    }
}

/* Optional sugar
 *
 *In Vector, you could add a .clone() alias for copy(), or a .toPoint() if you ever need to treat a vector as a point.
 * */
