// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Coord.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/06 20:20:31 by jeportie          #+#    #+#             //
//   Updated: 2025/08/07 15:10:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Represents a 2D coordinate point.
 */
export default class Coord {
    /**
     * Creates a new Coord instance.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a copy of this coordinate.
     * @returns {Coord} A new Coord instance with the same x and y values.
     */
    copy() {
        return new this.constructor(this.x, this.y);
    }

    /**
     * Adds another Coord to this one without modifying the original.
     * @param {Coord} src - The source Coord to add.
     * @returns {Coord} A new Coord representing the sum.
     */
    add(src) {
        return new this.constructor(this.x + src.x, this.y + src.y);
    }

    /**
     * Adds another Coord to this one, modifying this instance.
     * @param {Coord} src - The source Coord to add.
     * @returns {Coord} This instance after addition.
     */
    addSelf(src) {
        this.x += src.x;
        this.y += src.y;
        return this;
    }

    /**
     * Subtracts another Coord from this one without modifying the original.
     * @param {Coord} src - The source Coord to subtract.
     * @returns {Coord} A new Coord representing the difference.
     */
    sub(src) {
        return new this.constructor(this.x - src.x, this.y - src.y);
    }

    /**
     * Subtracts another Coord from this one, modifying this instance.
     * @param {Coord} src - The source Coord to subtract.
     * @returns {Coord} This instance after subtraction.
     */
    subSelf(src) {
        this.x -= src.x;
        this.y -= src.y;
        return this;
    }

    /**
     * Scales this coordinate by a factor without modifying the original.
     * @param {number} factor - The scale factor.
     * @returns {Coord} A new Coord scaled by the given factor.
     */
    scale(factor) {
        return new this.constructor(this.x * factor, this.y * factor);
    }

    /**
     * Scales this coordinate by a factor, modifying this instance.
     * @param {number} factor - The scale factor.
     * @returns {Coord} This instance after scaling.
     */
    scaleSelf(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /**
     * Divides this coordinate by a factor without modifying the original.
     * @param {number} factor - The divisor.
     * @returns {Coord} A new Coord divided by the given factor.
     */
    div(factor) {
        return new this.constructor(this.x / factor, this.y / factor);
    }

    /**
     * Divides this coordinate by a factor, modifying this instance.
     * @param {number} factor - The divisor.
     * @returns {Coord} This instance after division.
     */
    divSelf(factor) {
        this.x /= factor;
        this.y /= factor;
        return this;
    }

    /**
     * Negates this coordinate without modifying the original.
     * @returns {Coord} A new Coord with both x and y negated.
     */
    negate() {
        return new this.constructor(-this.x, -this.y);
    }

    /**
     * Negates this coordinate, modifying this instance.
     * @returns {Coord} This instance after negation.
     */
    negateSelf() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Checks if this coordinate is equal to another.
     * @param {Coord} src - The source Coord to compare.
     * @returns {boolean} True if both x and y are equal, otherwise false.
     */
    equals(src) {
        return this.x === src.x && this.y === src.y;
    }

    /**
     * Calculates the Euclidean distance to another coordinate.
     * @param {Coord} src - The source Coord to measure distance to.
     * @returns {number} The distance between this and the source coordinate.
     */
    distanceTo(src) {
        const dx = this.x - src.x;
        const dy = this.y - src.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Returns a string representation of this coordinate.
     * @returns {string} The string in the form '(x, y)'.
     */
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
