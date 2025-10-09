// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   config.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:50:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

export const defaults = {
    N: 300,
    seed: 1337,
    mapName: null,
    baseRadius: 150,
    radiusVelocityGain: 3.0,
    mouseStrength: 0.095,
    originK: 0.0012,
    damping: 0.979,
    linkDist: 130,
    timeScale: 0.8,
};
