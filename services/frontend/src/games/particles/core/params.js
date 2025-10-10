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
    N: { type: "number", default: 700, min: 0 },
    seed: { type: "number", default: 1337 },
    mapName: { type: "string", default: null },

    baseRadius: { type: "number", default: 150, min: 10, max: 600 },
    radiusVelocityGain: { type: "number", default: 3, min: 0 },
    mouseStrength: { type: "number", default: 0.09, min: 0, max: 1 },
    originK: { type: "number", default: 0.0012 },
    damping: { type: "number", default: 0.979, min: 0, max: 1 },
    linkDist: { type: "number", default: 130, min: 10, max: 400 },
    timeScale: { type: "number", default: 0.6, min: 0.1, max: 10 },

    flyerSpeedMin: { type: "number", default: 8, min: 0 },
    flyerSpeedMax: { type: "number", default: 18, min: 0 },
    flyerSpawnMin: { type: "number", default: 1, min: 0 },
    flyerSpawnMax: { type: "number", default: 3, min: 0 },
    flyerMaxAtOnce: { type: "number", default: 3, min: 1 },
    flyerCooldownMinMs: { type: "number", default: 2200, min: 0 },
    flyerCooldownMaxMs: { type: "number", default: 5200, min: 0 },
    breathe: { type: "boolean", default: false },
};

/**
 * Merge any partial params with defaults defined above.
 */
export function normalizeParams(params = {}) {
    const out = {};
    for (const [key, meta] of Object.entries(PARAM_SCHEMA)) {
        out[key] = params[key] ?? meta.default;
    }
    return out;
}

