// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Flyer.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 09:23:47 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 10:21:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Point, Vector } from "@jeportie/lib2d";

export default class Flyer {
    constructor(particle, stateRef) {
        this.state = stateRef;
        this.current = particle;
        this.prev = null;
        this.dir = Vector.fromAngle(Math.random() * Math.PI * 2);
        this.speed = this.state.params.flyerSpeedMin + Math.random() * (this.state.params.flyerSpeedMax - this.state.params.flyerSpeedMin);
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
        if (pos.x > this.state.width - margin) return "right";
        if (pos.y < margin) return "top";
        if (pos.y > this.state.height - margin) return "bottom";
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
        this.speed = 30 + Math.random() * 60; // wide speed variation

        // pick a distant pseudo-target to drift toward
        const travelDist = 200 + Math.random() * 500;
        this.target = new Point(
            this.pos.x + this.dir.x * travelDist,
            this.pos.y + this.dir.y * travelDist
        );
    }

    update(dt) {
        // Move forward in current direction
        const scale = 0.2
        const vx = this.dir.x * this.speed * dt * scale;
        const vy = this.dir.y * this.speed * dt * scale;
        this.pos.x += vx;
        this.pos.y += vy;

        // excite local particles around flyer position
        this._lightCurrentRoute();

        // occasionally change direction
        if (Math.random() < 0.02) this.setNextTarget();

        // bounce or wrap at borders
        if (this.pos.x < 0) {
            this.pos.x = this.state.width;
            this.setNextTarget();
        }
        if (this.pos.x > this.state.width) {
            this.pos.x = 0;
            this.setNextTarget();
        }
        if (this.pos.y < 0) {
            this.pos.y = this.state.height;
            this.setNextTarget();
        }
        if (this.pos.y > this.state.height) {
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
        const influenceR = 120;
        const glow = 0.8 + Math.sin(performance.now() * 0.002) * 0.2;

        // Interpolate along the path (flyer position)
        const fx = this.pos.x;
        const fy = this.pos.y;

        // excite nearby particles in small area
        for (const p of this.state.particles) {
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
        this.state.activeSegments.push({ a: pA, b: pB, fade: glow });
    }

    render(ctx) {
        // nothing visible directly
    }
}
