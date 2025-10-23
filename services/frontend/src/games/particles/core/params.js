// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   params.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:34:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 15:22:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const PARAM_SCHEMA = {
    /* ---------- System / Layout ---------- */
    N: { type: "number", default: 200, min: 0, max: 1200, description: "Total particles rendered." },
    seed: { type: "number", default: 1337, description: "Deterministic random seed for layout & init velocities." },
    mapName: { type: "string", default: "", description: "Optional map file name under /maps (without .json). Empty = random scatter." },

    /* ---------- Interaction / Motion ---------- */
    baseRadius: { type: "number", default: 150, min: 10, max: 600, description: "Base cursor influence radius (px)." },
    radiusVelocityGain: { type: "number", default: 3, min: 0, description: "How much mouse speed enlarges influence radius." },
    mouseStrength: { type: "number", default: 0.09, min: 0, max: 1, description: "Attraction of particles towards the cursor." },
    originK: { type: "number", default: 0.0012, min: 0.0001, max: 0.01, description: "Spring pullback towards each particle’s origin." },
    damping: { type: "number", default: 0.979, min: 0, max: 1, description: "Velocity damping applied every frame." },
    linkDist: { type: "number", default: 130, min: 10, max: 400, description: "Max distance for drawing links between particles (px)." },
    timeScale: { type: "number", default: 0.6, min: 0.1, max: 10, description: "Global time multiplier for simulation steps." },

    /* ---------- Visual ---------- */
    particleRadiusMin: { type: "number", default: 0.7, min: 0.1, max: 10, description: "Minimum particle radius." },
    particleRadiusMax: { type: "number", default: 1.7, min: 0.1, max: 20, description: "Maximum particle radius." },

    /* ---------- Physics init ---------- */
    initVelScale: { type: "number", default: 0.4, min: 0, max: 5, description: "Scale for initial random velocities." },
    maxVel: { type: "number", default: 5, min: 0.1, max: 50, description: "Velocity clamp per component." },

    /* ---------- Flyers (glow streaks) ---------- */
    flyerSpeedMin: { type: "number", default: 8, min: 0, description: "Minimum flyer base speed." },
    flyerSpeedMax: { type: "number", default: 18, min: 0, description: "Maximum flyer base speed." },
    flyerSpeedAmpFac: { type: "number", default: 0.25, min: 0, max: 3, description: "Breathing amplitude factor of flyer speed (× base)." },
    flyerWanderJitter: { type: "number", default: 1.2, min: 0, max: 10, description: "Random wander angular jitter (rad/s)." },
    flyerWanderStrength: { type: "number", default: 0.55, min: 0, max: 2, description: "Weight of wander direction in flyer heading." },
    flyerFlowStrength: { type: "number", default: 0.35, min: 0, max: 2, description: "Weight of global flow field in flyer heading." },
    flyerTurnResp: { type: "number", default: 4.0, min: 0.1, max: 20, description: "How quickly flyers turn towards desired heading." },
    flyerAvoidMargin: { type: "number", default: 120, min: 0, max: 1000, description: "Edge margin where flyers start steering inward (px)." },
    flyerAvoidStrength: { type: "number", default: 0.8, min: 0, max: 3, description: "Strength of edge avoidance vector." },
    flyerLightRadius: { type: "number", default: 90, min: 10, max: 400, description: "Radius around flyers lighting nearby particles (px)." },
    flyerSpawnMin: { type: "number", default: 1, min: 0, description: "Minimum flyers per spawn burst." },
    flyerSpawnMax: { type: "number", default: 3, min: 0, description: "Maximum flyers per spawn burst." },
    flyerMaxAtOnce: { type: "number", default: 3, min: 1, description: "Maximum alive flyers at the same time." },
    flyerCooldownMinMs: { type: "number", default: 2200, min: 0, description: "Minimum cooldown between spawns (ms)." },
    flyerCooldownMaxMs: { type: "number", default: 5200, min: 0, description: "Maximum cooldown between spawns (ms)." },
    flyerMaxAffectedParticles: { type: "number", default: 90, min: 10, description: "Maximum particules affected by the flyer" },

    /* ---------- Special modes ---------- */
    breathe: { type: "boolean", default: false, description: "Enable subtle breathing modulation (alters originK over time)." },
    breatheSpeed: { type: "number", default: 0.38, min: 0.3, max: 10, description: "Speed of the breathing oscillation (Hz)." },
    breatheDepth: { type: "number", default: 1.73, min: 0.10, max: 10.00, description: "Maximum outward offset in pixels per particle." },
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

