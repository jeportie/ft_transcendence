// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   reflect.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 14:47:22 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:57:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Reflect a vector `v` across a (unit) normal `n`.
 * v' = v - 2 * (v·n) * n
 * @param {{x:number,y:number}} v
 * @param {{x:number,y:number}} n - Should be normalized (unit length).
 * @returns {{x:number,y:number}} Reflected vector.
 */
export function reflectVector(v, n) {
    const dot = v.x * n.x + v.y * n.y;
    return { x: v.x - 2 * dot * n.x, y: v.y - 2 * dot * n.y };
}

/**
 * Normalize a vector safely (returns {0,0} if near zero).
 * @param {{x:number,y:number}} v
 * @returns {{x:number,y:number}}
 */
export function normalize(v) {
    const m = Math.hypot(v.x, v.y) || 0;
    if (m === 0) return { x: 0, y: 0 };
    return { x: v.x / m, y: v.y / m };
}
