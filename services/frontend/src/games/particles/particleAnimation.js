// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   particleAnimation.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/08 20:58:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:27:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { ParticleEngine } from "./core/engine.js";
import { toggleCinematicMode, setParticleMap, setSeed } from "./core/controls.js";
import { DPR, defaults } from "./core/config.js";
import Mouse from "./class/Mouse.js";
import Particle from "./class/Particle.js";

const state = {
    particles: /** @type {Particle[]} */ ([]),
    mouse: new Mouse(),
    params: { ...defaults },
    width: 0,
    height: 0,
    flyers: [],
    flyerSpawnCooldown: 0,
    currentMode: "cinematic",
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

    Object.assign(state.params, options);
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
    })();
    return () => {
        engine.stop();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onLeave);
    };
}

export { toggleCinematicMode, setParticleMap, setSeed };
toggleCinematicMode(state, true);
