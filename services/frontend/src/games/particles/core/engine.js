// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   engine.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 10:59:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 09:44:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Vector, GameLoop } from "@jeportie/lib2d";
import Particle from "../class/Particle.js";
import Flyer from "../class/Flyer.js";
import { seededRand } from "./utils.js";
import { drawBackground, drawLinks } from "./draw.js";
import { loadMapJson, applyMapToParticles } from "./mapLoader.js";
import { Events } from "./events.js";

export class ParticleEngine {
    constructor(ctx, state) {
        this.ctx = ctx;
        this.state = state;
        this.loop = null;
        this.accumulator = 0;
        this.fixedDt = 1 / 60; // physics at 60 Hz
        this.lastFrame = performance.now();
    }

    resize(canvas, DPR) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        this.state.width = w;
        this.state.height = h;
        canvas.width = Math.floor(w * DPR);
        canvas.height = Math.floor(h * DPR);
        this.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    async initSystem({ N, seed, mapName }) {
        const { state } = this;

        if (mapName) {
            try {
                const json = await loadMapJson(mapName);
                const mapSeed = json.seed ?? seed;
                this._seededInit(N, mapSeed);
                applyMapToParticles(state, json.points || [], N);
                return;
            } catch (e) {
                console.warn(`[Particles] Map "${mapName}" failed to load.`, e);
            }
        }
        this._seededInit(N, seed);
    }

    _seededInit(N, seed) {
        const rand = seededRand(seed);
        const { state } = this;
        const w = state.width;
        const h = state.height;

        state.particles.length = 0;
        for (let i = 0; i < N; i++) {
            const px = rand() * w;
            const py = rand() * h;
            const p = new Particle(px, py, state);
            p.vel = new Vector((rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4);
            state.particles.push(p);
        }
    }

    start() {
        const step = () => {
            const now = performance.now();
            let frameTime = (now - this.lastFrame) / 1000;
            this.lastFrame = now;
            // clamp spikes (tab switch, etc.)
            frameTime = Math.min(frameTime, 0.1);

            this.accumulator += frameTime;
            while (this.accumulator >= this.fixedDt) {
                this._updatePhysics(this.fixedDt);
                this.accumulator -= this.fixedDt;
            }
            this._render();
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    stop() {
        this.loop?.stop();
    }

    _updatePhysics(dt) {
        const { ctx, state } = this;
        const { params, mouse } = state;

        Events.emit("flyer.spawn", state.flyers.length);
        Events.emit("params.changed", state.params);
        // breathing mode
        if (params.breathe) {
            const t = performance.now() * 0.0002;
            params.originK = 0.00035 + 0.0001 * Math.sin(t);
        }

        mouse.update();
        dt *= state.params.timeScale ?? 1.0;

        for (const p of state.particles) p.update(dt);
        for (const f of state.flyers) f.update(dt);
        state.flyers = state.flyers.filter(f => f.life > 0);

        // --- flyer lifecycle & spawning ---
        for (const f of state.flyers) f.update(dt);
        state.flyers = state.flyers.filter(f => f.life > 0);

        // When none or few are alive, consider spawning a small burst
        state.flyerSpawnCooldown -= dt * 1000;
        const {
            flyerSpawnMin,
            flyerSpawnMax,
            flyerMaxAtOnce,
            flyerCooldownMinMs,
            flyerCooldownMaxMs,
        } = state.params;

        if (state.flyerSpawnCooldown <= 0) {
            const capacity = Math.max(0, flyerMaxAtOnce - state.flyers.length);
            if (capacity > 0) {
                const want = Math.min(
                    capacity,
                    Math.floor(Math.random() * (flyerSpawnMax - flyerSpawnMin + 1)) + flyerSpawnMin
                );
                for (let i = 0; i < want; i++) {
                    const randP = state.particles[Math.floor(Math.random() * state.particles.length)];
                    if (randP) state.flyers.push(new Flyer(randP, state));
                }
            }
            // reset next spawn delay (random window)
            state.flyerSpawnCooldown =
                flyerCooldownMinMs + Math.random() * (flyerCooldownMaxMs - flyerCooldownMinMs);
        }


        for (const f of state.flyers) f.update(dt);
        for (const f of state.flyers) f.render(ctx);
        state.flyers = state.flyers.filter(f => f.life > 0);
    }

    _render() {
        const { ctx, state } = this;
        drawBackground(ctx, state);
        state.activeSegments = [];
        drawLinks(ctx, state);
        for (const p of state.particles) p.render(ctx);
        for (const f of state.flyers) f.render(ctx);
    }
}
