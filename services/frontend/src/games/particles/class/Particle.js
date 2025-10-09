// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Particle.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 09:27:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 10:56:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Circle, Point, Vector } from "@jeportie/lib2d";
import { clamp, lerp } from "../core/utils.js";

export default class Particle extends Circle {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, stateRef) {
        const r = 1.0 + Math.random() * 0.5; // radius variation
        super(x, y, r);
        this.state = stateRef;
        this.origin = new Point(x, y);
        this.vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
        this.speedMag = 0;

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

        if (mouse.has) {
            const dx = mouse.pos.x - this.pos.x;
            const dy = mouse.pos.y - this.pos.y;
            const dist2 = dx * dx + dy * dy;
            const dist = Math.sqrt(dist2);

            if (dist > 0.5 && dist < influenceR) {
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

        // --- constant pull toward origin (uniform) ---
        const ox = this.origin.x - this.pos.x;
        const oy = this.origin.y - this.pos.y;

        this.vel.x += ox * params.originK;
        this.vel.y += oy * params.originK;

        // --- damping & motion ---
        this.vel.scaleSelf(params.damping);

        const maxVel = 5;
        this.vel.x = clamp(this.vel.x, -maxVel, maxVel);
        this.vel.y = clamp(this.vel.y, -maxVel, maxVel);

        this.pos.move(this.vel, 1);

        const { width, height } = this.state;

        // wrap edges
        if (this.pos.x < -10) this.pos.x = width + 10;
        if (this.pos.x > width + 10) this.pos.x = -10;
        if (this.pos.y < -10) this.pos.y = height + 10;
        if (this.pos.y > height + 10) this.pos.y = -10;

        this.speedMag = this.vel.magnitude;
    }

    render(ctx) {
        const { mouse, params } = this.state;

        // decay flyer-induced glow
        this._flyerGlow = (this._flyerGlow || 0) * 0.98;

        // --- color stops (cool → hot)
        const stops = [
            // { r: 147, g: 197, b: 253 }, // #93c5fd  blue
            // { r: 167, g: 243, b: 208 }, // #a7f3d0  mint
            this.baseColor,
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
        t = (t * this.state.mouse.fade) + (this._flyerGlow || 0);
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
