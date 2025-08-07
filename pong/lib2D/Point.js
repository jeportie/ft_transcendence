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

/**
 * Represents a 2D point that can be translated, extending Coord.
 * @extends Coord
 */
export default class Point extends Coord {
    /**
     * Translates this point by the given vector, modifying this instance.
     * @param {Coord} vector - The translation vector.
     * @returns {Point} This instance after translation.
     */
    translate(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return (this);
    }
}
