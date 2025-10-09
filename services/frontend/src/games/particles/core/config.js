// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   config.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:13:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

export const defaults = {
    N: 350,
    seed: 1337,
    mapName: null,
    baseRadius: 200,
    radiusVelocityGain: 3,
    mouseStrength: 0.05,
    originK: 0.0004,
    damping: 0.975,
    linkDist: 130,
};
