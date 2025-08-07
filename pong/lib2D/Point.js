// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Point.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/07 14:57:33 by jeportie          #+#    #+#             //
//   Updated: 2025/08/07 15:02:07 by jeportie         ###   ########.fr       //
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
}

/* Optional sugar

You might add a Point.subtractVector(v: Vector): Point so that point.subVector(vector) gives you a new point “moved back” by a vector, rather than overloading subSelf. */
