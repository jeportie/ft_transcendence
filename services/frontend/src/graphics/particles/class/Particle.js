// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Particle.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 09:27:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 15:14:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Circle, Point, Vector } from "@jeportie/lib2d";
import { clamp, lerp } from "../core/utils.js";
import { colorThemes } from "../core/colorThemes.js";

export default class Particle extends Circle {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, stateRef) {
        const p = stateRef?.params || {};
        const rMin = Math.min(p.particleRadiusMin ?? 0.7, p.particleRadiusMax ?? 1.7);
        const rMax = Math.max(p.particleRadiusMin ?? 0.7, p.particleRadiusMax ?? 1.7);
        const r = rMin + Math.random() * (rMax - rMin);
        super(x, y, r);
        this.state = stateRef;
        this.origin = new Point(x, y);
        const vScale = p.initVelScale ?? 0.4;
        this.vel = new Vector((Math.random() - 0.5) * vScale, (Math.random() - 0.5) * vScale);

        this.speedMag = 0;
        this.glow = 0;          // current eased glow
        this.glowTarget = 0;    // target set by flyers

        // assign subtle color offset (blue ↔ mint)
        const baseMix = Math.random() * 0.5; // 0=blue, 1=mint
        const blue = { r: 147, g: 197, b: 253 }; // #93c5fd
        const mint = { r: 167, g: 243, b: 208 }; // #a7f3d0
        this.baseColor = {
            r: Math.round(blue.r + (mint.r - blue.r) * baseMix),
            g: Math.round(blue.g + (mint.g - blue.g) * baseMix),
            b: Math.round(blue.b + (mint.b - blue.b) * baseMix),
        };
    }

    update(dt) {
        const { mouse, params } = this.state;

        // --- mouse influence ---
        const influenceR = params.baseRadius + mouse.speed * params.radiusVelocityGain;
        this.glowTarget *= 0.96;
        const ease = 1 - Math.exp(-dt * 6); // ~200ms rise time
        this.glow += (this.glowTarget - this.glow) * ease;

        if (mouse.has && mouse.speed > 0.5) {
            const speedFactor = clamp(mouse.speed / 20, 0, 1); // normalize motion intensity
            const moveIntensity = 1 - speedFactor; // slower → stronger
            if (moveIntensity > 0.05) {
                const dx = mouse.pos.x - this.pos.x;
                const dy = mouse.pos.y - this.pos.y;
                const dist2 = dx * dx + dy * dy;
                const dist = Math.sqrt(dist2);

                if (dist > 0.9 && dist < influenceR) {
                    const sigma = influenceR * 0.5;
                    const strength = params.mouseStrength * moveIntensity *
                        Math.exp(-(dist * dist) / (2 * sigma * sigma));

                    const fx = (dx / dist) * strength;
                    const fy = (dy / dist) * strength;

                    this.vel.x += fx;
                    this.vel.y += fy;
                }
            }
        }

        // --- constant pull toward origin (uniform) ---
        const ox = this.origin.x - this.pos.x;
        const oy = this.origin.y - this.pos.y;

        this.vel.x += ox * params.originK;
        this.vel.y += oy * params.originK;

        // --- damping & motion ---
        this.vel.scaleSelf(params.damping);

        const maxVel = params.maxVel ?? 5;
        this.vel.x = clamp(this.vel.x, -maxVel, maxVel);
        this.vel.y = clamp(this.vel.y, -maxVel, maxVel);

        this.pos.move(this.vel, 1);

        const { width, height } = this.state;


        // --- breathing offset (center-based global motion) ---
        if (params.breathe) {
            if (this.breathePhase === undefined)
                this.breathePhase = Math.random() * Math.PI * 2;

            // increment phase
            this.breathePhase += dt * params.breatheSpeed * Math.PI * 2;

            // center of the screen
            const cx = this.state.width * 0.5;
            const cy = this.state.height * 0.5;

            // direction from center to particle
            const dx = this.pos.x - cx;
            const dy = this.pos.y - cy;
            const dist = Math.hypot(dx, dy) || 1;
            const dirX = dx / dist;
            const dirY = dy / dist;

            // breathing offset: slow sinusoidal push/pull
            const globalBreath = Math.sin(performance.now() * 0.001 * params.breatheSpeed);
            const personalPhase = Math.sin(this.breathePhase) * 0.3; // desync factor
            const offset = (globalBreath + personalPhase) * params.breatheDepth;

            this.pos.x += dirX * offset * dt;
            this.pos.y += dirY * offset * dt;
        }
    }


    render(ctx) {
        const { mouse, params } = this.state;
        const themeName = this.state.currentTheme || "default";
        const stops = colorThemes[themeName] || colorThemes.default;
        const influenceR = params.baseRadius + mouse.speed * params.radiusVelocityGain;

        let t = 0;

        if (mouse.has) {
            const d = this.pos.distanceTo(mouse.pos);
            const norm = clamp(1 - d / influenceR, 0, 1);

            // organic / semi-random distance curve
            const jitter = 0.15 * Math.sin(norm * 6 + performance.now() * 0.002);
            t = Math.pow(norm, 1.4) * (0.9 + jitter);
        }

        t = (t * this.state.mouse.fade) + this.glow;
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
        const idleBoost = 0.4 + Math.pow(1 - this.state.mouse.fade, 2.0) * 1.8;
        // Glow increases near center + idle brightness + flicker
        const glow = (4 + Math.pow(t, 2.4) * 70 * (1 + flicker * 0.5)) * idleBoost;


        ctx.save();
        ctx.shadowBlur = glow;

        // smoother overall luminance transition
        const hoverBoost = 1 + this.state.mouse.fade * 0.3;
        const idleColorBoost = (0.8 + Math.pow(1 - this.state.mouse.fade, 1.6) * 0.6) * hoverBoost;
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
