// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   DropletManager.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 19:14:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 19:51:44 by jeportie         ###   ########.fr       //
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
        for (const [idx, d] of this.droplets) {
            // ease alpha to target
            const k = 1 - Math.exp(-d.smooth * dt);
            d.alpha += (d.target - d.alpha) * k;

            // kill when fully hidden
            if (d.alpha < 0.01 && d.target === 0) {
                d.mesh.dispose();
                this.droplets.delete(idx);
                continue;
            }

            // anchor basis
            const a = getAnchorLocal(idx);
            if (!a) continue;
            const n = getAnchorNormal(idx) ?? a.normalizeToNew();

            // make a stable tangent basis (u, v) around n
            const any = Math.abs(n.y) < 0.9 ? new BABYLON.Vector3(0, 1, 0) : new BABYLON.Vector3(1, 0, 0);
            const u = BABYLON.Vector3.Cross(n, any).normalize();
            const v = BABYLON.Vector3.Cross(n, u).normalize();

            // animated params
            d.t += dt;
            const grow = d.alpha;                      // 0..1
            // optional: organic breathing effect
            const wobble = 1 + 0.05 * Math.sin(d.t * 6 + idx);
            const R = d.maxRadius * grow * wobble;
            // const R = d.maxRadius * grow;              // droplet radius
            const off = d.maxOffset * Math.pow(grow, 0.8); // outward offset along normal

            // follow the anchor
            d.centerLocal.copyFrom(a).addInPlace(n.scale(off));




            // write particle positions for a sphere around center
            const pos = d.positions;
            const count = d.count;
            // --- rotation on itself ---
            d.spin += d.spinSpeed * dt;
            const rotMat = BABYLON.Matrix.RotationAxis(d.rotationAxis, d.spin);

            // --- write particle positions for the rotated seed cloud ---
            for (let i = 0; i < count; i++) {
                const base = i * 3;
                const s = d.seeds[i];
                const rotated = BABYLON.Vector3.TransformCoordinates(s, rotMat);
                pos[base] = d.centerLocal.x + rotated.x * R;
                pos[base + 1] = d.centerLocal.y + rotated.y * R;
                pos[base + 2] = d.centerLocal.z + rotated.z * R;
            }

            d.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, pos, false);

            // 🎨 smooth emissive fade from white to the droplet's color
            if (d.baseColor) {
                const blendedColor = BABYLON.Color3.Lerp(
                    new BABYLON.Color3(1, 1, 1),
                    d.baseColor,
                    d.alpha
                );
                d.mat.emissiveColor = blendedColor;
            }

            // subtle pulse in point size
            const pulse = 1 + 0.1 * Math.sin(d.t * 5);
            d.mat.pointSize = d.pointSize * (0.7 + 0.3 * grow) * pulse;
            d.mat.alpha = 0.8 * grow;
        }
    }

    _createDroplet(idx, {
        count = 40,
        maxRadius = 0.010,
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
