// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   preset.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:01:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:11:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const motionPresets = {
    cinematic: {
        originK: 0.00035,
        damping: 0.975,
        flyerSpeedMin: 6,
        flyerSpeedMax: 55,
        baseRadius: 110,
        backgroundAlpha: 0.15,
        breathe: true,
    },
    reactive: {
        originK: 0.001,
        damping: 0.985,
        flyerSpeedMin: 15,
        flyerSpeedMax: 150,
        baseRadius: 100,
        backgroundAlpha: 1,
        breathe: false,
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

