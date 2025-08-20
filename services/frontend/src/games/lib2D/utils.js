// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   utils.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:18:58 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:20:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/** Clamp v into [min, max]. */
export function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/** Degrees → radians. */
export const deg2rad = (d) => (d * Math.PI) / 180;
/** Radians → degrees. */
export const rad2deg = (r) => (r * 180) / Math.PI;
