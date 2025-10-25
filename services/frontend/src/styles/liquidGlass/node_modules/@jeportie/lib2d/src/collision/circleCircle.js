// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   circleCircle.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:00:38 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:00:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Check overlap between two circles and compute penetration/normal.
 * @param {{x:number,y:number,r:number}} c1
 * @param {{x:number,y:number,r:number}} c2
 * @returns {{collides:boolean, normal:{x:number,y:number}, penetration:number}} 
 */
export function collideCircleCircle(c1, c2) {
    const dx = c2.x - c1.x, dy = c2.y - c1.y;
    const dist = Math.hypot(dx, dy);
    const sumR = c1.r + c2.r;
    if (dist >= sumR || dist === 0) {
        // no collision or concentric (undefined normal). For concentric, pick a default normal.
        const n = dist === 0 ? { x: 1, y: 0 } : { x: dx / dist, y: dy / dist };
        return { collides: false, normal: n, penetration: 0 };
    }
    return { collides: true, normal: { x: dx / dist, y: dy / dist }, penetration: sumR - dist };
}
