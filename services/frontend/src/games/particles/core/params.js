// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   params.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:34:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 09:35:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const PARAM_SCHEMA = {
    N: { type: "number", default: 500, min: 0 },
    baseRadius: { type: "number", default: 150, min: 10, max: 600 },
    radiusVelocityGain: { type: "number", default: 3, min: 0 },
    mouseStrength: { type: "number", default: 0.09, min: 0, max: 1 },
    originK: { type: "number", default: 0.0012 },
    damping: { type: "number", default: 0.979, min: 0, max: 1 },
    flyerSpeedMin: { type: "number", default: 5 },
    flyerSpeedMax: { type: "number", default: 15 },
    flyerSpawnMin: { type: "number", default: 1 },
    flyerSpawnMax: { type: "number", default: 3 },
    flyerCooldownMinMs: { type: "number", default: 2500 },
    flyerCooldownMaxMs: { type: "number", default: 5000 },
    timeScale: { type: "number", default: 1 },
};

export function normalizeParams(params = {}) {
    const out = {};
    for (const [key, { default: def }] of Object.entries(PARAM_SCHEMA)) {
        out[key] = params[key] ?? def;
    }
    return out;
}
