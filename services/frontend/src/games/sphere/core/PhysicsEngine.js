// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PhysicsEngine.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 12:04:06 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:35:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export class PhysicsEngine {
    constructor(scene, camera, root, brush, geom) {
        this.scene = scene;
        this.camera = camera;
        this.root = root;
        this.brush = brush;
        this.geom = geom;
        this.ROT_SPEED = BABYLON.Tools.ToRadians(1);
        this.ripples = [];
        this.hasPointer = false;
        this.lastHit = new BABYLON.Vector3(0, geom.R + 0.08, 0);
        this.register();
    }

    handleMouse() {
        this.hasPointer = true;
    }

    triggerRipple() {
        const rest = this.geom.rest;
        this.ripples.length = 0;
        const RIPPLE_COUNT = 20;
        for (let i = 0; i < RIPPLE_COUNT; i++) {
            const p = rest[(Math.random() * rest.length) | 0];
            this.ripples.push({
                pos: p.clone(),
                phase: Math.random() * Math.PI * 2,
                strength: 60,
                t: 0,
            });
        }
    }

    register() {
        const { scene, camera, root, geom, brush, ripples } = this;
        const engine = scene.getEngine();
        const EPS = 0.08;
        const brushLocal = new BABYLON.Vector3();
        let hasPointer = false;
        let cursorHidden = false;
        const canvasEl = engine.getRenderingCanvas();

        // Track pointer presence
        canvasEl?.addEventListener("mouseenter", () => (hasPointer = true));
        canvasEl?.addEventListener("mouseleave", () => (hasPointer = false));

        // --- Helper: ray-sphere intersection
        function raySphereNearestT(o, d, R) {
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

        scene.registerBeforeRender(() => {
            const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
            root.rotation.y += dt * this.ROT_SPEED;

            const { R, rest, pos, vel, positions, colors, mesh, COUNT } = geom;
            const tmp1 = new BABYLON.Vector3();
            const tmp2 = new BABYLON.Vector3();
            const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 4;

            // === Brush tracking =====================================================
            if (hasPointer) {
                const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
                const invRoot = root.getWorldMatrix().clone().invert();
                const oL = BABYLON.Vector3.TransformCoordinates(ray.origin, invRoot);
                const dL = BABYLON.Vector3.TransformNormal(ray.direction, invRoot).normalize();
                const t = raySphereNearestT(oL, dL, R);
                let hitL;
                if (t !== null) hitL = oL.add(dL.scale(t));
                else hitL = oL.add(dL.scale(-BABYLON.Vector3.Dot(oL, dL))).normalize().scale(R);
                this.lastHit = hitL.clone();
                brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
            } else {
                brushLocal.copyFrom(this.lastHit);
            }
            brush.position.copyFrom(brushLocal);

            // === Cursor visibility ==================================================
            let active = false;
            if (hasPointer) {
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
                active = gap < 180;

                if (canvasEl) {
                    if (active && !cursorHidden) {
                        canvasEl.style.cursor = "none";
                        cursorHidden = true;
                    } else if (!active && cursorHidden) {
                        canvasEl.style.cursor = "default";
                        cursorHidden = false;
                    }
                }
            }

            // === Ripple decay =======================================================
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.t += dt;
                r.strength *= 0.855;
                if (r.strength < 0.05) ripples.splice(i, 1);
            }

            // === Particle physics ===================================================
            for (let i = 0; i < COUNT; i++) {
                const p = pos[i], v = vel[i], r0 = rest[i];

                tmp1.copyFrom(r0).subtractInPlace(p).scaleInPlace(K_REST);
                const rLen = p.length();
                tmp2.copyFrom(p).normalize().scaleInPlace((R - rLen) * K_RAD);
                tmp1.addInPlace(tmp2);
                tmp1.addInPlace(v.scale(-DAMP));

                // Brush influence
                if (active) {
                    const toB = brushLocal.subtract(p);
                    const dist = toB.length();
                    if (dist < 0.45) {
                        const fall = (1 - dist / 0.45) ** 2;
                        tmp1.addInPlace(p.normalizeToNew().scale(10 * 8 * fall));
                    }
                }

                // Ripple influence
                for (let j = 0; j < ripples.length; j++) {
                    const r = ripples[j];
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

            // === Depth fade + point size from visible-face origin (correct face & space) ===

            // Push control: + moves the origin toward the camera (outside the sphere),
            //               - moves it inside the sphere along the same axis
            const DEPTH_OFFSET = 0.3; // try 0.0, 0.5, -0.5

            // 1) FRONT point on the sphere along the camera axis (world space)
            const toCamDir = camera.position.subtract(camera.target).normalize(); // target -> camera
            const depthOriginWorld = camera.target.add(toCamDir.scale(geom.R + DEPTH_OFFSET));

            // 2) Convert to root-LOCAL space to match 'positions' (which are root-local)
            const invRootDepth = root.getWorldMatrix().clone().invert();
            const depthOrigin = BABYLON.Vector3.TransformCoordinates(depthOriginWorld, invRootDepth);

            // Visual tuning (independent of zoom)
            const minDist = 0.0;  // distance at the origin point
            const maxDist = 7.0;  // how far the fade stretches

            // size contrast
            const nearSize = 3.5; // front
            const farSize = 0.05; // back

            // color contrast
            const nearColor = 1.5;  // white (front)
            const farColor = 0.01;  // dark (back)

            let sizeAccum = 0;

            for (let i = 0; i < COUNT; i++) {
                const k = i * 3;
                const c = i * 4;

                const dx = positions[k] - depthOrigin.x;
                const dy = positions[k + 1] - depthOrigin.y;
                const dz = positions[k + 2] - depthOrigin.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // 0 near → 1 far
                const t = Math.min(Math.max((dist - minDist) / (maxDist - minDist), 0), 1);

                // Stronger falloff so the front pops
                const fade = Math.pow(1.0 - t, 2.8);

                // color: front = white, back = dark
                const col = farColor + (nearColor - farColor) * fade;
                colors[c] = colors[c + 1] = colors[c + 2] = col;
                colors[c + 3] = 1.0;

                // accumulate to drive a single GPU point size
                sizeAccum += nearSize * fade + farSize * (1.0 - fade);
            }

            // one global point size (Babylon pointsCloud uses a single size)
            mesh.material.pointSize = sizeAccum / COUNT;

            // push updates
            mesh.updateVerticesData(BABYLON.VertexBuffer.ColorKind, colors, false);
            mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, false);

        });
    }
}
