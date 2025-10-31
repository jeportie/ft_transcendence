// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PhysicsEngine.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 15:25:43 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 15:58:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";
import { DropletManager } from "./DropletManager.js";

export class PhysicsEngine {
    constructor(scene, camera, root, brush, geom) {
        // --- Core refs
        this.scene = scene;
        this.camera = camera;
        this.root = root;
        this.brush = brush;
        this.geom = geom;

        // --- State
        this.ROT_SPEED = BABYLON.Tools.ToRadians(1);
        this.ripples = [];
        this.hasPointer = false;
        this.lastHit = new BABYLON.Vector3(0, geom.R + 0.08, 0);

        // Hover “extra rest” shaping
        this.hoverAnchorIdx = null;
        this.hoverTarget = 0;            // 1 when active, 0 when inactive
        this.hoverAlpha = 0;             // smoothed towards target
        this.hoverProfile = new Float32Array(geom.COUNT); // per-point weights
        this.HOVER_RADIUS = 0.22;        // narrow footprint (σ)
        this.HOVER_HEIGHT = 0.12;        // tall lift
        this.HOVER_SMOOTH = 8.0;         // how fast alpha eases (larger = snappier)

        this.droplets = new DropletManager(scene, root);
        this.register();
    }

    // === INPUT / EVENTS =======================================================
    handleMouse() {
        this.hasPointer = true;
    }

    setHoverAnchor(idx, color = null) {
        this.hoverAnchorIdx = Number.isInteger(idx) ? idx : null;

        if (this.hoverAnchorIdx === null) {
            // release all droplets
            for (const [k] of this.droplets.droplets) this.droplets.release(k);
        } else {
            // ensure droplet exists & appears, forward color
            this.droplets.ensure(this.hoverAnchorIdx, { color });
        }
    }

    rebuildHoverProfile() {
        const { COUNT, rest } = this.geom;
        this.hoverProfile.fill(0);
        if (this.hoverAnchorIdx === null) return;
        const anchor = rest[this.hoverAnchorIdx];
        if (!anchor) return;
        const sigma2 = this.HOVER_RADIUS * this.HOVER_RADIUS; // Gaussian σ²
        for (let i = 0; i < COUNT; i++) {
            const p0 = rest[i];
            const dx = p0.x - anchor.x;
            const dy = p0.y - anchor.y;
            const dz = p0.z - anchor.z;
            const d2 = dx * dx + dy * dy + dz * dz;
            // Gaussian falloff; clamp tiny tails to zero
            const w = Math.exp(-d2 / (2 * sigma2));
            this.hoverProfile[i] = w > 1e-3 ? w : 0;
        }
    }

    triggerRipple() {
        const RIPPLE_COUNT = 20;
        const rest = this.geom.rest;
        this.ripples = Array.from({ length: RIPPLE_COUNT }, () => ({
            pos: rest[(Math.random() * rest.length) | 0].clone(),
            phase: Math.random() * Math.PI * 2,
            strength: 60,
            t: 0,
        }));
    }

    // === REGISTER LOOP ========================================================
    register() {
        const engine = this.scene.getEngine();
        const canvasEl = engine.getRenderingCanvas();

        canvasEl?.addEventListener("mouseenter", () => (this.hasPointer = true));
        canvasEl?.addEventListener("mouseleave", () => (this.hasPointer = false));

        this.scene.registerBeforeRender(() => this.update(engine));
    }

    // === MAIN LOOP (only orchestration!) ======================================
    update(engine) {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        this.root.rotation.y += dt * this.ROT_SPEED;

        this.updateBrush(dt);
        this.updateCursor(engine);
        this.updateRipples(dt);
        this.updateParticles(dt);
        // update droplets after particles so overlay reads latest centers
        this.droplets.update(
            dt,
            (idx) => this.geom.pos[idx] ?? this.geom.rest[idx],
            (idx) => {
                const p = this.geom.pos[idx] ?? this.geom.rest[idx];
                return p ? p.normalizeToNew() : null;
            }
        );
        this.updateDepthFade();
    }

    // === SUBTASKS =============================================================

    updateBrush(dt) {
        const { scene, camera, root, geom, brush } = this;
        const EPS = 0.08;
        const brushLocal = new BABYLON.Vector3();

        if (this.hasPointer) {
            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const invRoot = root.getWorldMatrix().clone().invert();
            const oL = BABYLON.Vector3.TransformCoordinates(ray.origin, invRoot);
            const dL = BABYLON.Vector3.TransformNormal(ray.direction, invRoot).normalize();

            const t = this.raySphereNearestT(oL, dL, geom.R);
            const hitL = t !== null
                ? oL.add(dL.scale(t))
                : oL.add(dL.scale(-BABYLON.Vector3.Dot(oL, dL))).normalize().scale(geom.R);

            this.lastHit = hitL.clone();
            brushLocal.copyFrom(hitL.normalizeToNew().scale(geom.R + EPS));
        } else {
            brushLocal.copyFrom(this.lastHit);
        }
        brush.position.copyFrom(brushLocal);
        this.brushLocal = brushLocal;
    }

    raySphereNearestT(o, d, R) {
        const b = BABYLON.Vector3.Dot(o, d);
        const c = BABYLON.Vector3.Dot(o, o) - R * R;
        const disc = b * b - c;
        if (disc < 0) return null;
        const s = Math.sqrt(disc);
        const t0 = -b - s, t1 = -b + s;
        if (t0 >= 0) return t0;
        if (t1 >= 0) return t1;
        return null;
    }

    updateCursor(engine) {
        const { scene, root, brush, camera } = this;
        const canvasEl = engine.getRenderingCanvas();
        if (!this.hasPointer || !canvasEl) return;

        const renderW = engine.getRenderWidth();
        const renderH = engine.getRenderHeight();
        const brush2D = BABYLON.Vector3.Project(
            BABYLON.Vector3.TransformCoordinates(brush.position, root.getWorldMatrix()),
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(renderW, renderH)
        );

        const dx = scene.pointerX - brush2D.x;
        const dy = scene.pointerY - brush2D.y;
        const gap = Math.sqrt(dx * dx + dy * dy);
        const active = gap < 180;

        if (active && !this.cursorHidden) {
            canvasEl.style.cursor = "none";
            this.cursorHidden = true;
        } else if (!active && this.cursorHidden) {
            canvasEl.style.cursor = "default";
            this.cursorHidden = false;
        }
        this.cursorActive = active;
    }

    updateRipples(dt) {
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const r = this.ripples[i];
            r.t += dt;
            r.strength *= 0.855;
            if (r.strength < 0.05) this.ripples.splice(i, 1);
        }
    }

    updateParticles(dt) {
        const { geom, brushLocal, ripples, cursorActive } = this;
        const { R, rest, pos, vel, positions, colors, mesh, COUNT } = geom;

        const tmp1 = new BABYLON.Vector3();
        const tmp2 = new BABYLON.Vector3();
        const K_REST = 90, K_RAD = 55, DAMP_BASE = 3, MAX = 4;

        // slightly higher damping while bulge is active (prevents wiggle)
        const DAMP = DAMP_BASE + 2.0 * this.hoverAlpha;

        for (let i = 0; i < COUNT; i++) {
            const p = pos[i], v = vel[i], r0 = rest[i];

            // --- “extra rest” along normal, narrow & tall, eased by hoverAlpha
            const lift = this.HOVER_HEIGHT * this.hoverAlpha * this.hoverProfile[i];
            // normal from origin (like your radial spring)
            const nrm = p.length() > 1e-6 ? p.normalizeToNew() : r0.normalizeToNew();
            const rTargetX = r0.x + nrm.x * lift;
            const rTargetY = r0.y + nrm.y * lift;
            const rTargetZ = r0.z + nrm.z * lift;

            tmp1.copyFrom(r0).subtractInPlace(p).scaleInPlace(K_REST);
            // spring to (rest + extraLift)
            tmp1.set(rTargetX - p.x, rTargetY - p.y, rTargetZ - p.z).scaleInPlace(K_REST);
            const rLen = p.length();
            tmp2.copyFrom(p).normalize().scaleInPlace((R - rLen) * K_RAD);
            tmp1.addInPlace(tmp2);
            tmp1.addInPlace(v.scale(-DAMP));

            // Brush force
            if (cursorActive) {
                const toB = brushLocal.clone().subtractInPlace(p);
                const dist = toB.length();
                if (dist < 0.45) {
                    const fall = (1 - dist / 0.45) ** 2;
                    tmp1.addInPlace(p.normalizeToNew().scale(80 * fall));
                }
            }



            // Ripple force
            for (const r of ripples) {
                const dx = p.x - r.pos.x;
                const dy = p.y - r.pos.y;
                const dz = p.z - r.pos.z;
                const d2 = dx * dx + dy * dy + dz * dz;
                if (d2 < 0.55 * 0.55) {
                    const d = Math.sqrt(d2);
                    const amp = Math.sin(d * 10 - r.t * 15 + r.phase) * r.strength * (1 - d / 0.55);
                    const invLen = 1 / (rLen + 1e-6);
                    v.x += p.x * invLen * amp * dt;
                    v.y += p.y * invLen * amp * dt;
                    v.z += p.z * invLen * amp * dt;
                }
            }

            v.addInPlace(tmp1.scale(dt));
            if (v.lengthSquared() > MAX * MAX) v.normalize().scaleInPlace(MAX);
            p.addInPlace(v.scale(dt));

            const k = i * 3;
            positions[k] = p.x;
            positions[k + 1] = p.y;
            positions[k + 2] = p.z;
        }
        geom.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, false);
    }

    updateDepthFade() {
        const { geom, camera, root } = this;
        const { positions, colors, COUNT } = geom;

        const DEPTH_OFFSET = 0.3;
        const toCamDir = camera.position.subtract(camera.target).normalize();
        const depthOriginWorld = camera.target.add(toCamDir.scale(geom.R + DEPTH_OFFSET));
        const invRoot = root.getWorldMatrix().clone().invert();
        const depthOrigin = BABYLON.Vector3.TransformCoordinates(depthOriginWorld, invRoot);

        const minDist = 0.0, maxDist = 7.0;
        const nearSize = 3.5, farSize = 0.05;
        const nearColor = 1.5, farColor = 0.01;

        let sizeAccum = 0;

        for (let i = 0; i < COUNT; i++) {
            const k = i * 3, c = i * 4;
            const dx = positions[k] - depthOrigin.x;
            const dy = positions[k + 1] - depthOrigin.y;
            const dz = positions[k + 2] - depthOrigin.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            const t = Math.min(Math.max((dist - minDist) / (maxDist - minDist), 0), 1);
            const fade = Math.pow(1.0 - t, 2.8);
            const col = farColor + (nearColor - farColor) * fade;

            colors[c] = colors[c + 1] = colors[c + 2] = col;
            colors[c + 3] = 1.0;

            sizeAccum += nearSize * fade + farSize * (1.0 - fade);
        }

        geom.mesh.material.pointSize = sizeAccum / COUNT;
        geom.mesh.updateVerticesData(BABYLON.VertexBuffer.ColorKind, colors, false);
    }
}
