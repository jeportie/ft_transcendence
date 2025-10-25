// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   circleRect.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:01:12 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:02:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Clamp a value to a [min, max] interval.
 * @param {number} v
 * @param {number} lo
 * @param {number} hi
 * @returns {number}
 */
function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

/**
 * Circle vs axis-aligned rect collision (rect at x,y with width w and height h).
 * Returns collision state, contact normal (from rect to circle), and penetration.
 * @param {{x:number,y:number,r:number}} circle - circle center (x,y) and radius r.
 * @param {{x:number,y:number,w:number,h:number}} rect - rect top-left (x,y) and size.
 * @returns {{collides:boolean, normal:{x:number,y:number}, penetration:number, closest:{x:number,y:number}}}
 */
export function collideCircleRect(circle, rect) {
    const cx = clamp(circle.x, rect.x, rect.x + rect.w);
    const cy = clamp(circle.y, rect.y, rect.y + rect.h);
    const dx = circle.x - cx;
    const dy = circle.y - cy;
    const dist = Math.hypot(dx, dy);

    if (dist >= circle.r || dist === 0) {
        // no overlap or center exactly on corner/edge point
        let nx = 0, ny = 0;
        if (dist > 0) { nx = dx / dist; ny = dy / dist; }
        else {
            // pick a normal pointing outwards based on shallowest axis
            const left = Math.abs(circle.x - rect.x);
            const right = Math.abs(circle.x - (rect.x + rect.w));
            const top = Math.abs(circle.y - rect.y);
            const bottom = Math.abs(circle.y - (rect.y + rect.h));
            const m = Math.min(left, right, top, bottom);
            if (m === left) nx = -1; else if (m === right) nx = 1; else if (m === top) ny = -1; else ny = 1;
        }
        return { collides: false, normal: { x: nx, y: ny }, penetration: 0, closest: { x: cx, y: cy } };
    }

    return {
        collides: true,
        normal: { x: dx / dist, y: dy / dist },
        penetration: circle.r - dist,
        closest: { x: cx, y: cy }
    };
}
