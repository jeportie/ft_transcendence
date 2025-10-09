// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   engine.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 10:59:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:00:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Vector, GameLoop } from "@jeportie/lib2d";
import Particle from "../class/Particle.js";
import Flyer from "../class/Flyer.js";
import { seededRand } from "./utils.js";
import { drawBackground, drawLinks } from "./draw.js";
import { loadMapJson, applyMapToParticles } from "./mapLoader.js";

export class ParticleEngine {
    constructor(ctx, state) {
        this.ctx = ctx;
        this.state = state;
        this.loop = null;
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
        this.loop = new GameLoop((dt) => this._update(dt));
        this.loop.start();
    }

    stop() {
        this.loop?.stop();
    }

    _update(dt) {
        const { ctx, state } = this;
        const { params, mouse } = state;

        // breathing mode
        if (params.breathe) {
            const t = performance.now() * 0.0002;
            params.originK = 0.00035 + 0.0001 * Math.sin(t);
        }

        mouse.update();
        dt *= 0.5;

        drawBackground(ctx, state);
        for (const p of state.particles) p.update(dt);

        state.activeSegments = [];
        drawLinks(ctx, state);
        for (const p of state.particles) p.render(ctx);

        // flyer system
        if (state.flyerSpawnCooldown <= 0) {
            const n = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < n; i++) {
                const randP = state.particles[Math.floor(Math.random() * state.particles.length)];
                if (randP) state.flyers.push(new Flyer(randP, state));
            }
            state.flyerSpawnCooldown = 1500 + Math.random() * 1000;
        }

        for (const f of state.flyers) f.update(dt);
        for (const f of state.flyers) f.render(ctx);
        state.flyers = state.flyers.filter(f => f.life > 0);
    }
}
