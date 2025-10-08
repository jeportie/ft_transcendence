// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   particleAnimation.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/08 20:58:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 01:50:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //


import { Circle, Point, Vector, GameLoop } from "@jeportie/lib2d";

/* =========================
   Config & Globals
   ========================= */
const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

let w = 0, h = 0;
let ctx;
let loop;

const defaults = {
    N: 140,
    seed: 1337,
    mapName: null,
    baseRadius: 200,          // tighter influence
    radiusVelocityGain: 3,   // smaller growth
    mouseStrength: 0.05,
    originK: 0.0004, //Particle speed
    damping: 0.975, //Particle speed
    linkDist: 130,
};

/* =========================
   Motion Presets
   ========================= */
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

function applyMotionPreset(name) {
    const preset = motionPresets[name];
    if (!preset) return;

    Object.assign(state.params, preset);
    state.currentMode = name;

    // live update flyer speed range
    state.flyers.forEach(f => {
        f.speed = preset.flyerSpeedMin + Math.random() * (preset.flyerSpeedMax - preset.flyerSpeedMin);
    });
}


const state = {
    particles: /** @type {Particle[]} */ ([]),
    mouse: { pos: new Point(0, 0), has: false, speed: 0, fade: 0 },
    lastMouse: new Point(0, 0),
    params: { ...defaults },
};

state.flyers = [];
state.flyerSpawnCooldown = 0;

/* =========================
   Utils
   ========================= */

// deterministic PRNG (Mulberry32)
function mulberry32(seed) {
    return function() {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;

function hexToRgb(hex) {
    if (typeof hex !== "string" || !hex.startsWith("#")) {
        // fallback color if input invalid
        return { r: 147, g: 197, b: 253 }; // sky-300
    }
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToCss({ r, g, b }, a = 1) {
    return a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}

/* =========================
   Flying Sparks (neuronal trails)
   ========================= */


class Flyer {
    constructor(particle) {
        this.current = particle;
        this.prev = null;
        this.dir = Vector.fromAngle(Math.random() * Math.PI * 2);
        this.speed = state.params.flyerSpeedMin + Math.random() * (state.params.flyerSpeedMax - state.params.flyerSpeedMin);
        this.progress = 0;
        this.age = 0;
        this.life = 1;
        this.hops = 0;
        this.maxHops = 200;
        this.visited = new Set([particle]);
        this.next = null;
        this.pos = particle.pos.clone();
        this.startEdge = this._edgeZone(this.pos);
        this.fadeTrail = []; // store fading segments {a,b,intensity}
        this.setNextTarget();
    }

    _edgeZone(pos) {
        const margin = 805
        if (pos.x < margin) return "left";
        if (pos.x > w - margin) return "right";
        if (pos.y < margin) return "top";
        if (pos.y > h - margin) return "bottom";
        return "center";
    }

    _shouldStop() {
        const edge = this._edgeZone(this.pos);
        if (edge === "center") return false;
        if (this.startEdge === "left" && edge === "right") return true;
        if (this.startEdge === "right" && edge === "left") return true;
        if (this.startEdge === "top" && edge === "bottom") return true;
        if (this.startEdge === "bottom" && edge === "top") return true;
        return false;
    }


    setNextTarget() {
        // pick a new direction randomly but keep some inertia
        const angleChange = (Math.random() - 0.5) * Math.PI * 0.5; // turn ±45°
        const currentAngle = Math.atan2(this.dir.y, this.dir.x);
        const newAngle = currentAngle + angleChange;

        this.dir = Vector.fromAngle(newAngle).normalize();
        this.speed = 30 + Math.random() * 220; // wide speed variation

        // pick a distant pseudo-target to drift toward
        const travelDist = 200 + Math.random() * 500;
        this.target = new Point(
            this.pos.x + this.dir.x * travelDist,
            this.pos.y + this.dir.y * travelDist
        );
    }

    update(dt) {
        // Move forward in current direction
        const vx = this.dir.x * this.speed * dt;
        const vy = this.dir.y * this.speed * dt;
        this.pos.x += vx;
        this.pos.y += vy;

        // excite local particles around flyer position
        this._lightCurrentRoute();

        // occasionally change direction
        if (Math.random() < 0.02) this.setNextTarget();

        // bounce or wrap at borders
        if (this.pos.x < 0) {
            this.pos.x = w;
            this.setNextTarget();
        }
        if (this.pos.x > w) {
            this.pos.x = 0;
            this.setNextTarget();
        }
        if (this.pos.y < 0) {
            this.pos.y = h;
            this.setNextTarget();
        }
        if (this.pos.y > h) {
            this.pos.y = 0;
            this.setNextTarget();
        }

        // fade trail memory
        for (const seg of this.fadeTrail) seg.intensity *= 0.96;
        this.fadeTrail = this.fadeTrail.filter(s => s.intensity > 0.02);

        // aging
        this.age += dt;
        if (this.age > 15) this.life = 0; // die after ~15s
    }


    _lightCurrentRoute() {
        const pA = this.current;
        const pB = this.next;

        // small local effect radius (~50 px)
        const influenceR = 90;
        const glow = 0.8 + Math.sin(performance.now() * 0.002) * 0.2;

        // Interpolate along the path (flyer position)
        const fx = this.pos.x;
        const fy = this.pos.y;

        // excite nearby particles in small area
        for (const p of state.particles) {
            const dx = fx - p.pos.x;
            const dy = fy - p.pos.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < influenceR * influenceR) {
                const dist = Math.sqrt(dist2);
                const falloff = Math.exp(-(dist * dist) / (2 * (influenceR * 0.5) ** 2));

                // stronger particle excitation
                p._flyerGlow = Math.min(2, (p._flyerGlow || 0) + falloff * 1);

                // small velocity kick
                const kick = 0.02 * falloff;
                p.vel.x += (Math.random() - 0.2) * kick;
                p.vel.y += (Math.random() - 0.2) * kick;
            }
        }

        // add bright local segment in visual memory
        state.activeSegments.push({ a: pA, b: pB, fade: glow });
    }


    render(ctx) {
        // nothing visible directly
    }
}


/* =========================
   Particle
   ========================= */

class Particle extends Circle {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super(x, y, 1.5);
        this.origin = new Point(x, y);
        this.vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
        this.speedMag = 0; // cache magnitude for glow
    }

    update(dt) {
        const { mouse, params } = state;

        // --- mouse influence radius
        const influenceR = params.baseRadius + mouse.speed * params.radiusVelocityGain;


        if (mouse.has) {
            const dx = mouse.pos.x - this.pos.x;
            const dy = mouse.pos.y - this.pos.y;
            const dist2 = dx * dx + dy * dy;
            const dist = Math.sqrt(dist2);

            if (dist > 0.5 && dist < influenceR) { // <-- safe zone
                const sigma = influenceR * 0.5;
                const strength = params.mouseStrength * Math.exp(-(dist * dist) / (2 * sigma * sigma));
                const fx = (dx / dist) * strength;
                const fy = (dy / dist) * strength;

                if (Number.isFinite(fx) && Number.isFinite(fy)) {
                    this.vel.x += fx;
                    this.vel.y += fy;
                }
            }
        }


        // elastic pull back to origin
        const ox = this.origin.x - this.pos.x;
        const oy = this.origin.y - this.pos.y;
        this.vel.x += ox * params.originK;
        this.vel.y += oy * params.originK;

        this.vel.scaleSelf(params.damping);
        this.pos.move(this.vel, 1);

        // wrap
        if (this.pos.x < -10) this.pos.x = w + 10;
        if (this.pos.x > w + 10) this.pos.x = -10;
        if (this.pos.y < -10) this.pos.y = h + 10;
        if (this.pos.y > h + 10) this.pos.y = -10;

        this.speedMag = this.vel.magnitude;
    }

    render(ctx) {
        const { mouse, params } = state;

        // decay flyer-induced glow
        this._flyerGlow = (this._flyerGlow || 0) * 0.93;

        // --- color stops (cool → hot)
        const stops = [
            { r: 147, g: 197, b: 253 }, // #93c5fd  blue
            { r: 167, g: 243, b: 208 }, // #a7f3d0  mint
            { r: 255, g: 255, b: 255 }, // #ffffff  white-hot
            { r: 253, g: 224, b: 71 }, // #fde047  yellow
            { r: 251, g: 146, b: 60 }  // #fb923c  orange
        ];

        let t = 0;
        const influenceR = params.baseRadius + mouse.speed * params.radiusVelocityGain;

        if (mouse.has) {
            const d = this.pos.distanceTo(mouse.pos);
            const norm = clamp(1 - d / influenceR, 0, 1);

            // organic / semi-random distance curve
            const jitter = 0.15 * Math.sin(norm * 6 + performance.now() * 0.002);
            t = Math.pow(norm, 1.4) * (0.9 + jitter);
        }

        // 🌀 Always apply fade, even if mouse.has = false
        t = (t * state.mouse.fade) + (this._flyerGlow || 0);
        t = Math.min(1, t);

        // Speed modulation — fast = cooler
        const slowFactor = 1 / (1 + mouse.speed * 0.05);
        t *= slowFactor;
        t = clamp(t, 0, 1);

        // interpolate between color stops
        const steps = stops.length - 1;
        const scaled = Math.pow(t, 0.7) * steps;
        const idx = Math.floor(scaled);
        const localT = scaled - idx;
        const c1 = stops[idx];
        const c2 = stops[Math.min(idx + 1, steps)];

        let r = Math.round(lerp(c1.r, c2.r, localT));
        let g = Math.round(lerp(c1.g, c2.g, localT));
        let b = Math.round(lerp(c1.b, c2.b, localT));

        // lightness + flicker based on speed
        const speedFactor = clamp(mouse.speed / 40, 0, 1);
        const flickerAmp = (1 - speedFactor) * 0.3;
        const flicker = Math.sin(performance.now() * 0.005 + this.pos.x * 0.05) * flickerAmp;
        const lightBoost = 1 + (1 - speedFactor) * 0.4 + flicker;

        r = Math.min(255, r * lightBoost);
        g = Math.min(255, g * lightBoost);
        b = Math.min(255, b * lightBoost);

        const fill = `rgb(${r | 0},${g | 0},${b | 0})`;

        // Global idle brightness boost when mouse leaves (inverse of fade)
        const idleBoost = 0.4 + Math.pow(1 - state.mouse.fade, 2.0) * 1.8;

        // Glow increases near center + idle brightness + flicker
        const glow = (4 + Math.pow(t, 2.4) * 70 * (1 + flicker * 0.5)) * idleBoost;


        ctx.save();
        ctx.shadowBlur = glow;

        // smoother overall luminance transition
        const hoverBoost = 1 + state.mouse.fade * 0.3;
        const idleColorBoost = (0.8 + Math.pow(1 - state.mouse.fade, 1.6) * 0.6) * hoverBoost;
        const brightR = Math.min(255, r * idleColorBoost);
        const brightG = Math.min(255, g * idleColorBoost);
        const brightB = Math.min(255, b * idleColorBoost);

        ctx.shadowColor = `rgb(${brightR | 0},${brightG | 0},${brightB | 0})`;
        ctx.fillStyle = `rgb(${brightR | 0},${brightG | 0},${brightB | 0})`;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.currentColor = { r, g, b, t };
    }

}

/* =========================
   Canvas helpers
   ========================= */

function drawBackground(ctx) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f16");
    g.addColorStop(1, "#05070b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
}

function drawLinks(ctx) {
    const { particles, params, mouse } = state;
    const maxD2 = params.linkDist * params.linkDist;

    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.pos.x - b.pos.x;
            const dy = a.pos.y - b.pos.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < maxD2) {
                const d = Math.sqrt(d2);
                const alpha = clamp(1 - d / params.linkDist, 0, 1);

                // Blend colors of both particles
                const ca = a.currentColor || { r: 148, g: 163, b: 184, t: 0 };
                const cb = b.currentColor || ca;
                const mixT = 0.5;
                const r = Math.round(lerp(ca.r, cb.r, mixT));
                const g = Math.round(lerp(ca.g, cb.g, mixT));
                const bcol = Math.round(lerp(ca.b, cb.b, mixT));

                // Fade with both distance AND distance to mouse
                let mouseFade = 1;
                if (mouse.has) {
                    const mDist = (a.pos.distanceTo(mouse.pos) + b.pos.distanceTo(mouse.pos)) * 0.5;
                    const mNorm = clamp(1 - mDist / (params.baseRadius * 2), 0, 1);
                    mouseFade = Math.pow(mNorm, 1.5);
                }

                // final alpha and slight glow-like brightness near hot points
                const bright = (ca.t + cb.t) * 0.5;
                const glowBoost = 0.6 + bright * 0.9;

                // When mouse is active → slight global boost, to smooth transition
                const hoverBoost = 0.3 + state.mouse.fade * 0.4; // 1.0 → 1.4

                // When mouse leaves → lines glow up softly
                const idleBoost = 0.3 + Math.pow(1 - state.mouse.fade, 1.6) * 1.5;

                const finalAlpha = 0.02 + alpha * (0.2 + 0.8 * mouseFade * state.mouse.fade) * glowBoost * hoverBoost * idleBoost;

                ctx.strokeStyle = `rgba(${r},${g},${bcol},${finalAlpha})`;
                ctx.beginPath();
                ctx.moveTo(a.pos.x, a.pos.y);
                ctx.lineTo(b.pos.x, b.pos.y);
                ctx.stroke();


            }
        }
    }
    // Overlay bright segments that are active
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = "lighter";
    for (const seg of state.activeSegments) {
        const { a, b, fade } = seg;
        ctx.strokeStyle = `rgba(255,255,200,${fade})`;
        ctx.beginPath();
        ctx.moveTo(a.pos.x, a.pos.y);
        ctx.lineTo(b.pos.x, b.pos.y);
        ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
}

function resize(canvas) {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

/* =========================
   Maps (dynamic import with fallback)
   ========================= */

/**
 * Load a particle map JSON from /maps/<name>.json
 * JSON format:
 * {
 *   "name": "constellation_name",
 *   "seed": 1234,
 *   "points": [ { "x": 0.1, "y": 0.2 }, ... ] // normalized 0..1
 * }
 */
async function loadMapJson(name) {
    const url = `/maps/${name}.json`;

    // Try dynamic import with JSON assertions (modern browsers / bundlers)
    try {
        // Some bundlers use: import(url, { assert: { type: 'json' } })
        const mod = await import(/* @vite-ignore */ url, { assert: { type: "json" } });
        return mod.default || mod; // depends on toolchain
    } catch {
        // Fallback to fetch
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch map ${name}: ${res.status}`);
        return await res.json();
    }
}

/**
 * Apply a normalized map to particles (fill or cycle to N).
 */
function applyMapToParticles(pointsNorm, N) {
    const pts = pointsNorm.length ? pointsNorm : [];
    for (let i = 0; i < N; i++) {
        const src = pts.length ? pts[i % pts.length] : null;
        if (src) {
            const x = src.x * w;
            const y = src.y * h;
            if (state.particles[i]) {
                state.particles[i].pos.x = x;
                state.particles[i].pos.y = y;
                state.particles[i].origin.x = x;
                state.particles[i].origin.y = y;
                // small randomized initial velocity:
                state.particles[i].vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
            } else {
                state.particles[i] = new Particle(x, y);
            }
        } else {
            // fallback random placement
            if (state.particles[i]) {
                state.particles[i].pos.x = Math.random() * w;
                state.particles[i].pos.y = Math.random() * h;
                state.particles[i].origin.x = state.particles[i].pos.x;
                state.particles[i].origin.y = state.particles[i].pos.y;
                state.particles[i].vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
            } else {
                state.particles[i] = new Particle(Math.random() * w, Math.random() * h);
            }
        }
    }
}

/* =========================
   Initialization
   ========================= */

function seededInit(N, seed) {
    const rand = mulberry32(seed);
    state.particles.length = 0;
    for (let i = 0; i < N; i++) {
        const px = rand() * w;
        const py = rand() * h;
        const p = new Particle(px, py);
        // small deterministic velocity
        p.vel = new Vector((rand() - 0.5) * 0.4, (rand() - 0.5) * 0.4);
        state.particles.push(p);
    }
}

async function initSystem({ N, seed, mapName } = state.params) {
    if (mapName) {
        try {
            const json = await loadMapJson(mapName);
            const mapSeed = json.seed ?? seed;
            // initialize with seed to have deterministic velocities
            seededInit(N, mapSeed);
            applyMapToParticles(json.points || [], N);
            return;
        } catch (e) {
            console.warn(`[Particles] Map "${mapName}" failed to load. Using seeded fallback.`, e);
        }
    }
    // fallback
    seededInit(N, seed);
}

/* =========================
   Mouse handling
   ========================= */

function updateMouseSpeed() {
    const dx = state.mouse.pos.x - state.lastMouse.x;
    const dy = state.mouse.pos.y - state.lastMouse.y;
    // simple pixel/frame speed (frame-agnostic enough here)
    const s = Math.hypot(dx, dy);
    // light smoothing
    state.mouse.speed = lerp(state.mouse.speed, s, 0.3);
    state.lastMouse.x = state.mouse.pos.x;
    state.lastMouse.y = state.mouse.pos.y;
    // Gradually ease mouse fade in/out
    const target = state.mouse.has ? 1 : 0;
    state.mouse.fade = lerp(state.mouse.fade, target, 0.02);
}

/* =========================
   Public API
   ========================= */

/**
 * Start the particle system on a canvas selector.
 * @param {string} id - CSS selector for the canvas.
 * @param {Partial<typeof defaults>} options - (optional) override defaults, e.g. { mapName: "orion" }
 *                                            maps are loaded from /maps/<mapName>.json
 */
export function runParticle(id, options = {}) {
    const canvas = document.querySelector(id);
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    if (!ctx) return;

    // merge options
    state.params = { ...defaults, ...options };

    const onResize = async () => {
        resize(canvas);
        await initSystem(state.params);
    };
    const onMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        state.mouse.pos.x = e.clientX - rect.left;
        state.mouse.pos.y = e.clientY - rect.top;
        state.mouse.has = true;
    };
    const onLeave = () => { state.mouse.has = false; };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    resize(canvas);

    // init & loop
    (async () => {
        await initSystem(state.params);


        loop = new GameLoop((dt) => {

            // soft breathing modulation
            if (state.params.breathe) {
                const t = performance.now() * 0.0002;
                state.params.originK = 0.00035 + 0.0001 * Math.sin(t);
            }
            updateMouseSpeed();
            dt *= 0.5;

            drawBackground(ctx);
            for (const p of state.particles) p.update(dt);
            state.activeSegments = [];
            drawLinks(ctx);
            for (const p of state.particles) p.render(ctx);


            // --- flying stars system ---

            if (state.flyerSpawnCooldown <= 0) {
                const n = Math.random() < 0.5 ? 1 : 2;
                for (let i = 0; i < n; i++) {
                    const randP = state.particles[Math.floor(Math.random() * state.particles.length)];
                    if (randP) {
                        const flyer = new Flyer(randP);
                        state.flyers.push(flyer);
                    }
                }                // faster respawn
                state.flyerSpawnCooldown = 1500 + Math.random() * 1000;
            }



            // update + render flyers
            for (const f of state.flyers) f.update(dt);
            for (const f of state.flyers) f.render(ctx);

            // cleanup old flyers
            state.flyers = state.flyers.filter(f => f.life > 0);

        });

        loop.start();
    })();

    // cleanup
    return () => {
        loop?.stop();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onLeave);
    };
}

export function toggleCinematicMode(enable = null) {
    const to = enable !== null
        ? (enable ? "cinematic" : "reactive")
        : (state.currentMode === "cinematic" ? "reactive" : "cinematic");

    applyMotionPreset(to);
    console.log(`[ParticleFX] Switched to ${to.toUpperCase()} mode`);
}

/**
 * Hot-swap to a new map at runtime (loads /maps/<name>.json)
 * @param {string|null} name
 */
export async function setParticleMap(name) {
    state.params.mapName = name;
    await initSystem(state.params);
}

/**
 * Change the seed (used when no map or to set deterministic velocities with maps)
 * @param {number} seed
 */
export async function setSeed(seed) {
    state.params.seed = seed | 0;
    await initSystem(state.params);
}

toggleCinematicMode(false);
