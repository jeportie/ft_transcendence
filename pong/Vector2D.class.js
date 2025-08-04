// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Vector2D.class.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:25:36 by jeportie          #+#    #+#             //
//   Updated: 2025/08/04 18:36:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// A true 2D vector: holds dx/dy but also has magnitude, normalization, inversion, rotation, etc.
export default class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	// Return a new Vector scaled by factor
	scale(factor) {
		return new Vector2D(this.x * factor, this.y * factor);
	}

	// The length (speed) of this vector
	get magnitude() {
		return Math.hypot(this.x, this.y);
	}

	// Return a unit-length version of this vector
	normalize() {
		const mag = this.magnitude || 1;
		return new Vector2D(this.x / mag, this.y / mag);
	}

	// Return a copy with Y component flipped
	invertY() {
		return new Vector2D(this.x, -this.y);
	}

	// Return a copy with X component flipped
	invertX() {
		return new Vector2D(-this.x, this.y);
	}

	// Rotate this vector by `angleRad` around the origin, return new Vector
	rotate(angleRad) {
		const cos = Math.cos(angleRad);
		const sin = Math.sin(angleRad);
		return new Vector2D(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos
		);
	}

	// Set this vector’s magnitude to a new value, preserving direction
	withMagnitude(newMag) {
		return this.normalize().scale(newMag);
	}
}
