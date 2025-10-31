// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   preset.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:01:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 14:58:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const motionPresets = {
    cinematic: {
        originK: 0.00015,
        damping: 0.975,
        flyerSpeedMin: 3,
        flyerSpeedMax: 12,
        baseRadius: 110,
        backgroundAlpha: 0.15,
        breathe: true,
        timeScale: 6.0,

        // optional overrides per preset
        flyerSpawnMin: 1,
        flyerSpawnMax: 2,
        flyerMaxAtOnce: 2,
        flyerCooldownMinMs: 2600,
        flyerCooldownMaxMs: 5600,
    },
    reactive: {
        originK: 0.001,
        damping: 0.985,
        flyerSpeedMin: 15,
        flyerSpeedMax: 30,
        baseRadius: 100,
        backgroundAlpha: 1,
        breathe: true,
        timeScale: 9.6,

        flyerSpawnMin: 1,
        flyerSpawnMax: 6,
        flyerMaxAtOnce: 6,
        flyerCooldownMinMs: 500,
        flyerCooldownMaxMs: 2000,
    },
};


export function applyMotionPreset(state, name) {
    const preset = motionPresets[name];
    if (!preset) return;

    Object.assign(state.params, preset);
    state.currentMode = name;

    state.flyers.forEach(f => {
        f.speed = preset.flyerSpeedMin + Math.random() * (preset.flyerSpeedMax - preset.flyerSpeedMin);
    });
}

