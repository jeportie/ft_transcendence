// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   DropletManager.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 19:14:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 19:23:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export class DropletManager {
    constructor(scene, root) {
        this.scene = scene;
        this.root = root;
        this.droplets = new Map(); // key = anchorIdx
    }

    has(idx) { return this.droplets.has(idx); }

    // Create or reactivate a droplet for anchor
    ensure(idx, opts = {}) {
        let d = this.droplets.get(idx);
        if (!d) {
            d = this._createDroplet(idx, opts);
            this.droplets.set(idx, d);
        }
        d.target = 1; // expand/show
        return d;
    }

    // Begin retract/die
    release(idx) {
        const d = this.droplets.get(idx);
        if (d) d.target = 0;
    }

    // Returns world position of droplet center if exists & visible (alpha>~0)
    getWorldCenter(idx) {
        const d = this.droplets.get(idx);
        if (!d || d.alpha < 0.05) return null;
        return BABYLON.Vector3.TransformCoordinates(d.centerLocal, this.root.getWorldMatrix());
    }


    update(dt, getAnchorLocal, getAnchorNormal) {
        const { scene } = this;
        const camera = scene.activeCamera;
        if (!camera) return;

        // === Shared depth fade (match PhysicsEngine.updateDepthFade) ===
        const rootWorld = this.root.getWorldMatrix();
        const invRoot = rootWorld.clone().invert();
        const DEPTH_OFFSET = 0.3;
        const toCamDir = camera.position.subtract(camera.target).normalize();
        const geomR = 1.5;
        const depthOriginWorld = camera.target.add(toCamDir.scale(geomR + DEPTH_OFFSET));
        const depthOrigin = BABYLON.Vector3.TransformCoordinates(depthOriginWorld, invRoot);

        const minDist = 0.0, maxDist = 9.0;
        const nearScale = 1.0, farScale = 0.9;
        const nearColor = 1.0, farColor = 0.2;

        // === Update all droplets ===
        for (const [idx, d] of this.droplets) {
            // smooth alpha toward target
            const k = 1 - Math.exp(-d.smooth * dt);
            d.alpha += (d.target - d.alpha) * k;

            // delete when invisible
            if (d.alpha < 0.01 && d.target === 0) {
                d.mesh.dispose();
                this.droplets.delete(idx);
                continue;
            }

            // anchor
            const a = getAnchorLocal(idx);
            if (!a) continue;
            const n = getAnchorNormal(idx) ?? a.normalizeToNew();

            // === Depth fade (apply to droplet as a whole) ===
            const dx = a.x - depthOrigin.x;
            const dy = a.y - depthOrigin.y;
            const dz = a.z - depthOrigin.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const t = Math.min(Math.max((dist - minDist) / (maxDist - minDist), 0), 1);
            const fade = Math.pow(1.0 - t, 2.8);
            const colorScale = farColor + (nearColor - farColor) * fade;
            const sizeScale = farScale + (nearScale - farScale) * fade;

            // === Animate droplet ===
            d.t += dt;
            const grow = d.alpha;
            const wobble = 1 + 0.05 * Math.sin(d.t * 6 + idx);
            const R = d.maxRadius * grow * wobble * sizeScale;
            d.centerLocal.copyFrom(a);

            // dynamic count fade
            const visibleCount = Math.max(3, Math.floor(d.count * (0.4 + 0.6 * fade)));
            const pos = d.positions;

            d.spin += d.spinSpeed * dt;
            const rotMat = BABYLON.Matrix.RotationAxis(d.rotationAxis, d.spin);

            const tmp = new BABYLON.Vector3();
            let base = 0;
            for (let i = 0; i < visibleCount; i++) {
                const s = d.seeds[i];
                const rotated = BABYLON.Vector3.TransformCoordinates(s, rotMat);
                tmp.copyFrom(d.centerLocal).addInPlace(rotated.scale(R));

                pos[base++] = tmp.x;
                pos[base++] = tmp.y;
                pos[base++] = tmp.z;
            }

            // 🧊 make sure remaining positions don’t keep old data
            for (let i = visibleCount * 3; i < d.count * 3; i++) pos[i] = NaN;

            d.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos, false);

            // === Material & appearance ===
            base = d.baseColor || new BABYLON.Color3(1, 1, 1);
            const dark = new BABYLON.Color3(0.1, 0.1, 0.1);
            const faded = BABYLON.Color3.Lerp(dark, base, colorScale);
            d.mat.emissiveColor = faded;
            d.mat.pointSize = d.pointSize * (0.7 + 0.3 * grow) * sizeScale;
            d.mat.alpha = 0.65 * grow * fade;
        }
    }

    _createDroplet(idx, {
        count = 400,
        maxRadius = 0.018,
        maxOffset = 0.1,
        pointSize = 1.5,
        orbitRadius = 0.00,
        orbitSpeed = 0.0,
        smooth = 5.0,
        color = "#ffc449", // can be hex or Color3
    } = {}) {
        // --- parse color safely ---
        const parsedColor =
            typeof color === "string"
                ? BABYLON.Color3.FromHexString(color)
                : color.clone ? color.clone() : new BABYLON.Color3(1, 1, 1);

        const mesh = new BABYLON.Mesh(`droplet_${idx}`, this.scene);
        mesh.parent = this.root;

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 4);

        // seeds: noisy spherical cloud (organic droplet look)
        const seeds = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);

            // adds irregular “surface” like bubbles / droplets
            const noise = (Math.random() - 0.5) * 0.4; // try 0.2 → 0.6 for different chaos
            const nx = x * (1 + noise);
            const ny = y * (1 + noise);
            const nz = z * (1 + noise);

            seeds.push(new BABYLON.Vector3(nx, ny, nz));

            const c = i * 4;
            colors[c] = parsedColor.r;
            colors[c + 1] = parsedColor.g;
            colors[c + 2] = parsedColor.b;
            colors[c + 3] = 1;
        }


        const vd = new BABYLON.VertexData();
        vd.positions = positions;
        vd.colors = colors;
        vd.applyToMesh(mesh, true);

        // ✅ use parsedColor, not the raw string
        const mat = new BABYLON.StandardMaterial(`dropletMat_${idx}`, this.scene);
        mat.pointsCloud = true;
        mat.pointSize = pointSize;
        mat.disableLighting = true;
        mat.emissiveColor = parsedColor.clone();
        mat.alpha = 0.0;
        mesh.material = mat;

        return {
            idx, mesh, mat,
            positions, seeds, count,
            maxRadius, maxOffset, pointSize,
            orbitRadius, orbitSpeed, smooth,
            alpha: 0, target: 0, t: 0,
            centerLocal: new BABYLON.Vector3(),
            baseColor: parsedColor,
            rotationAxis: new BABYLON.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            spin: 0,
            spinSpeed: (Math.random() * 0.5 + 0.5) * 1.5, // radians per second
        };
    }
}
