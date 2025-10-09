// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   controls.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:18:15 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:34:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { applyMotionPreset } from "./preset.js";
import { ParticleEngine } from "./engine.js";

/**
 * Toggle between cinematic and reactive motion presets.
 */
export function toggleCinematicMode(state, enable = null) {
    const to =
        enable !== null
            ? enable
                ? "cinematic"
                : "reactive"
            : state.currentMode === "cinematic"
                ? "reactive"
                : "cinematic";

    applyMotionPreset(state, to);
    console.log(`[ParticleFX] Switched to ${to.toUpperCase()} mode`);
}

/**
 * Hot-swap to a new map at runtime.
 */
export async function setParticleMap(state, name) {
    state.params.mapName = name;
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const engine = new ParticleEngine(ctx, state);
    await engine.initSystem(state.params);
}

/**
 * Change the particle seed (for deterministic layout).
 */
export async function setSeed(state, seed) {
    state.params.seed = seed | 0;
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const engine = new ParticleEngine(ctx, state);
    await engine.initSystem(state.params);
}
