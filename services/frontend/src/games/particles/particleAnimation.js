// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   particleAnimation.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/08 20:58:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 10:40:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { ParticleEngine } from "./core/engine.js";
import { toggleCinematicMode, setParticleMap, setSeed } from "./core/controls.js";
import { createConfig, DPR, defaults } from "./core/config.js";
import { createUIPanel } from "./core/uiPanel.js";

import Mouse from "./class/Mouse.js";
import Particle from "./class/Particle.js";

const state = {
    config: createConfig(),
    particles: ([]),
    mouse: new Mouse(),
    params: null,
    width: 0,
    height: 0,
    flyers: [],
    flyerSpawnCooldown: 0,
    currentMode: "reactive",
    // currentMode: "cinematic",
};

/**
 * Initialize and start the particle system.
 * @param {string} selector - CSS selector for the canvas.
 * @param {Partial<typeof defaults>} options - optional overrides.
 */
export function runParticle(selector, options = {}) {
    const canvas = document.querySelector(selector);
    if (!canvas) {
        console.warn(`[ParticleFX] Canvas not found: ${selector}`);
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.warn(`[ParticleFX] Unable to get 2D context.`);
        return;
    }

    Object.assign(state.config.params, options);
    state.params = state.config.params;
    const engine = new ParticleEngine(ctx, state);
    const onResize = async () => {
        engine.resize(canvas, DPR);
        await engine.initSystem(state.params);
    };
    const onMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        state.mouse.move(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onLeave = () => state.mouse.leave();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);
    (async () => {
        await onResize();
        engine.start();
        toggleCinematicMode(state, true);
        createUIPanel(state);
    })();
    return () => {
        engine.stop();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onLeave);
    };
}

export { toggleCinematicMode, setParticleMap, setSeed };
