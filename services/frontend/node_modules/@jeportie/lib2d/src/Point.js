// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Point.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/07 14:57:33 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:05:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Coord from "./Coord.js"
import Vector from "./Vector.js"

/**
 * Represents a 2D point that can be translated, extending Coord.
 * @extends Coord
 */
export default class Point extends Coord {
    /**
     * Factory: create a Point from raw x,y.
     * @param {number} x
     * @param {number} y
     * @returns {Point}
     */
    static from(x, y) {
        return new Point(x, y);
    }

    /**
     * Translates this point by the given vector, modifying this instance.
     * @param {Vector} vector - The translation vector.
     * @returns {Point} This instance after translation.
     */
    translate(vector) {
        if (!(vector instanceof Vector))
            throw new TypeError("Point.translate requires a Vector object");

        return (this.addSelf(vector));
    }

    /**
        * Add a Vector to this Point → new Point.
        * @param {Vector} v
        * @returns {Point}
     */
    add(vector) {
        if (!(vector instanceof Vector))
            throw new TypeError("Point.add requires a Vector object");

        const { x, y } = super.add(vector);
        return (new Point(x, y));
    }

    /**
     * In-place add a Vector to this Point → this Point.
     * @param {Vector} vector
     * @returns {Point}
     */
    addSelf(vector) {
        if (!(vector instanceof Vector))
            throw new TypeError("Point.addSelf requires a Vector object");

        super.addSelf(vector);
        return (this);
    }

    /**
     * Subtracts another Point from this one, yielding a Vector from the other point to this one.
     * @param {Point} pt - The point to subtract.
     * @returns {Vector} A new Vector representing (this − pt).
     */
    sub(point) {
        if (!(point instanceof Point))
            throw new TypeError("Point.sub requires a Point object");

        const { x, y } = super.sub(point);
        return (new Vector(x, y));
    }

    /**
     * In-place subtract another Point from this one, converting this Point into the resulting Vector coordinates.
     * @param {Point} point - The point to subtract.
     * @returns {Point} This instance, now mutated to the Vector difference.
     */
    subSelf(point) {
        if (!(point instanceof Point))
            throw new TypeError("Point.subSelf requires a Point object");

        const vector = this.sub(point);
        this.x = vector.x;
        this.y = vector.y;
        return (this);
    }

    /**
     * Renders this point as a single pixel on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
     * @param {Object} [options] - Rendering options.
     * @param {string} [options.color="#fff"] - Fill color of the pixel.
     * @returns {void}
     */
    render(ctx, { color = "#fff" } = {}) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, 1, 1);
    }

    /**
     * Moves this point in place by a velocity vector, scaled by delta time.
     * @param {Vector} velocity - The velocity to apply.
     * @param {number} dt - Delta time in seconds.
     * @returns {Point} This instance after moving.
     */
    move(velocity, dt = 1) {
        if (!(velocity instanceof Vector))
            throw new TypeError("Point.move requires a Vector");
        this.x += velocity.x * dt;
        this.y += velocity.y * dt;
        return this;
    }

    /**
     * Checks if this point is inside a rectangle.
     * @param {number} x - Rect X.
     * @param {number} y - Rect Y.
     * @param {number} w - Rect width.
     * @param {number} h - Rect height.
     * @returns {boolean} True if inside, false otherwise.
     */
    isInsideRect(x, y, w, h) {
        return this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h;
    }
}

/* Optional sugar

You might add a Point.subtractVector(v: Vector): Point so that point.subVector(vector) gives you a new point “moved back” by a vector, rather than overloading subSelf. */
