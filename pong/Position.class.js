// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Position.class.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/04 18:06:58 by jeportie          #+#    #+#             //
//   Updated: 2025/08/04 18:26:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// A simple 2D position: only holds x/y, and can be moved by a Vector
export default class Position {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	// Move this position by the given vector (in-place)
	translate(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
}
