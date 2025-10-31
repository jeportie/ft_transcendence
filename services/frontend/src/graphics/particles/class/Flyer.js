// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Flyer.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 22:55:56 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 14:03:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Point, Vector } from "@jeportie/lib2d";

function flowAngle(x, y, t) {
    // Smooth pseudo-noise angle field (cheap & continuous)
    // Tweak scales for different textures
    const s = 0.002;          // spatial scale
    const tt = t * 0.25;      // temporal scale
    const a = Math.sin(x * s + tt * 0.9) * 0.6;
    const b = Math.cos(y * s - tt * 0.7) * 0.6;
    const c = Math.sin((x + y) * s * 0.6 - tt * 0.5) * 0.4;
    return (a + b + c) * 0.45; // radians, gentle
}

export default class Flyer {
    constructor(particle, stateRef) {
        this.theme = "default";
        this.state = stateRef;
        this.current = particle;
        this.prev = null;

        this.dir = Vector.fromAngle(Math.random() * Math.PI * 2).normalize();

        // Base & variance pulled from preset min/max
        const {
            flyerSpeedMin = 8,
            flyerSpeedMax = 18,
            flyerSpeedAmpFac = 0.25,
            flyerWanderJitter = 1.2,
            flyerWanderStrength = 0.55,
            flyerFlowStrength = 0.35,
            flyerTurnResp = 4.0,
            flyerAvoidMargin = 120,
            flyerAvoidStrength = 0.8,
        } = this.state.params;
        this.baseSpeed = flyerSpeedMin + Math.random() * (flyerSpeedMax - flyerSpeedMin);
        this.speed = this.baseSpeed;
        this.speedAmp = this.baseSpeed * flyerSpeedAmpFac;   // breathing amplitude
        this.phase = Math.random() * Math.PI * 2;

        // Wander parameters
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderJitter = flyerWanderJitter;   // rad/sec of drift
        this.wanderStrength = flyerWanderStrength; // how strongly wander bends heading
        // Flow field influence
        this.flowStrength = flyerFlowStrength;   // how much the field biases heading
        // Heading response
        this.turnResponsiveness = flyerTurnResp; // how quickly heading follows desired (rad/sec)

        // Edge behaviour
        this.avoidMargin = flyerAvoidMargin;   // start steering back before wrap
        this.avoidStrength = flyerAvoidStrength; // weight of the avoidance vector

        // Lifecycle
        this.age = 0;
        this.life = 1;  // keep >0 to stay alive; you can fade this if needed later

        // Position/target bookkeeping
        this.hops = 0;
        this.maxHops = 200;
        this.visited = new Set([particle]);
        this.next = null;
        this.pos = particle.pos.clone();
        this.startEdge = this._edgeZone(this.pos);
    }

    _edgeZone(pos) {
        const m = 805;
        if (pos.x < m) return "left";
        if (pos.x > this.state.width - m) return "right";
        if (pos.y < m) return "top";
        if (pos.y > this.state.height - m) return "bottom";
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

    _desiredDirection(dt) {
        // Wander component (smoothly perturb a small circle ahead)
        this.wanderAngle += (Math.random() - 0.5) * this.wanderJitter * dt;
        const wanderDir = Vector.fromAngle(this.wanderAngle).normalize();

        // Flow field component (smooth global swirl)
        const t = performance.now() * 0.001;
        const fa = flowAngle(this.pos.x, this.pos.y, t);
        const flowDir = Vector.fromAngle(fa).normalize();

        // Edge avoidance (steer back toward center if near bounds)
        const { width, height } = this.state;
        let avoid = new Vector(0, 0);
        if (this.pos.x < this.avoidMargin) avoid.x += (this.avoidMargin - this.pos.x) / this.avoidMargin;
        if (this.pos.x > width - this.avoidMargin) avoid.x -= (this.pos.x - (width - this.avoidMargin)) / this.avoidMargin;
        if (this.pos.y < this.avoidMargin) avoid.y += (this.avoidMargin - this.pos.y) / this.avoidMargin;
        if (this.pos.y > height - this.avoidMargin) avoid.y -= (this.pos.y - (height - this.avoidMargin)) / this.avoidMargin;

        // Blend everything: current heading + wander + flow + avoidance
        const desired = new Vector(0, 0);
        desired.x =
            this.dir.x * (1.0 - this.wanderStrength - this.flowStrength) +
            wanderDir.x * this.wanderStrength +
            flowDir.x * this.flowStrength +
            avoid.x * this.avoidStrength * 0.5;
        desired.y =
            this.dir.y * (1.0 - this.wanderStrength - this.flowStrength) +
            wanderDir.y * this.wanderStrength +
            flowDir.y * this.flowStrength +
            avoid.y * this.avoidStrength * 0.5;

        return desired.normalize();
    }

    _lightNearbyParticles() {
        const influenceR = this.state.params.flyerLightRadius ?? 90;
        const maxAffectedParticules = this.state.params.flyerMaxAffectedParticles ?? 90;
        const influenceR2 = influenceR * influenceR;
        let hits = 0;
        const skip = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < this.state.particles.length; i += skip) {
            const p = this.state.particles[i];
            const dx = this.pos.x - p.pos.x;
            const dy = this.pos.y - p.pos.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < influenceR2) {
                const falloff = Math.exp(-dist2 / (2 * (influenceR * 0.5) ** 2));
                p.glowTarget = Math.min(1.5, (p.glowTarget || 0) + falloff * 0.6);
                hits++;
                if (hits > maxAffectedParticules) break;
            }
        }
    }

    update(dt) {
        this.age += dt;

        // Organic speed “breathing”
        this.phase += dt * (0.6 + Math.random() * 0.2);
        const breathe = Math.sin(this.phase) * 0.5 + 0.5;
        this.speed = this.baseSpeed + (breathe - 0.5) * 2 * this.speedAmp;

        // Compute desired heading (wander + flow + avoidance)
        const desired = this._desiredDirection(dt);

        // Turn toward desired smoothly
        // Interpolate heading by an angular responsiveness (approx “slerp” for 2D)
        const blend = Math.min(1, this.turnResponsiveness * dt);
        this.dir.x = this.dir.x * (1 - blend) + desired.x * blend;
        this.dir.y = this.dir.y * (1 - blend) + desired.y * blend;
        this.dir.normalizeSelf?.() || this.dir.normalize(); // support either API

        // Integrate position
        this.pos.x += this.dir.x * this.speed * dt;
        this.pos.y += this.dir.y * this.speed * dt;

        // Light up nearby nodes
        this._lightNearbyParticles();

        // Soft wrap (keep your existing wrap if you prefer hard wrap)
        const margin = 10;
        const { width, height } = this.state;
        if (this.pos.x < -margin) this.pos.x = width + margin;
        if (this.pos.x > width + margin) this.pos.x = -margin;
        if (this.pos.y < -margin) this.pos.y = height + margin;
        if (this.pos.y > height + margin) this.pos.y = -margin;

        // Optional: stop if crossed entire canvas (keeps paths varied)
        if (this._shouldStop()) this.life = 0;
    }

    render(_ctx) {
        // kept empty on purpose — you already render trails/links elsewhere
    }
}

