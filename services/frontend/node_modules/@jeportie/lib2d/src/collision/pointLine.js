// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pointLine.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:58:19 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:00:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Closest point on a segment AB to a point P.
 * @param {{x:number,y:number}} A
 * @param {{x:number,y:number}} B
 * @param {{x:number,y:number}} P
 * @returns {{x:number,y:number,t:number}} Closest point C and parameter t in [0,1]
 */
export function closestPointOnSegment(A, B, P) {
    const ABx = B.x - A.x, ABy = B.y - A.y;
    const APx = P.x - A.x, APy = P.y - A.y;
    const len2 = ABx * ABx + ABy * ABy || 1;

    let t = (APx * ABx + APy * ABy) / len2;
    t = Math.max(0, Math.min(1, t));

    return ({ x: A.x + t * ABx, y: A.y + t * ABy, t });
}

/**
 * Distance from a point P to a segment AB.
 * @param {{x:number,y:number}} A
 * @param {{x:number,y:number}} B
 * @param {{x:number,y:number}} P
 * @returns {number}
 */
export function distancePointToSegment(A, B, P) {
    const C = closestPointOnSegment(A, B, P);
    const dx = P.x - C.x, dy = P.y - C.y;

    return (Math.hypot(dx, dy));
}
