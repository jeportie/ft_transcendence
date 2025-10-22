// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   latitudeSystem.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 11:49:27 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 11:38:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export const createScene = (engine) => {
    const scene = createBaseScene(engine);

    const camera = createCamera(scene);
    const root = createRoot(scene);

    const geom = createGridGeometry(scene, root); // { R, rest, pos, vel, positions, colors, COUNT, latSeg, lonSeg, mesh }
    const { lineSys, connections } = createLineGrid(scene, root, geom.rest, geom.latSeg, geom.lonSeg);
    const brush = createBrush(scene, root);

    setupInteractions(scene, camera, root, brush, geom, lineSys, connections);

    return scene;
};

// ============================================================================
// === SCENE / CAMERA / ROOT =================================================
// ============================================================================

function createBaseScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.15, 0.15, 0.17);

    // Dynamic gradient background
    const layer = new BABYLON.Layer("bg", null, scene, true);
    layer.isBackground = true;

    function makeGradientTexture() {
        const canvas = engine.getRenderingCanvas();
        const w = Math.max(2, canvas?.width || 2);
        const h = Math.max(2, canvas?.height || 2);
        const tex = new BABYLON.DynamicTexture("bgTex", { width: w, height: h }, scene, false);
        const ctx = tex.getContext();
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "#0b0f16");
        g.addColorStop(1, "#3f0f0b");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        tex.update();
        return tex;
    }

    layer.texture = makeGradientTexture();
    engine.onResizeObservable.add(() => {
        layer.texture?.dispose();
        layer.texture = makeGradientTexture();
    });

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.4, 1, -0.3), scene);

    return scene;
}

function createCamera(scene) {
    const canvasEl = scene.getEngine().getRenderingCanvas();
    const camera = new BABYLON.ArcRotateCamera(
        "cam",
        BABYLON.Tools.ToRadians(0),
        BABYLON.Tools.ToRadians(50),
        6,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvasEl, true);
    camera.wheelPrecision = 30;
    if (canvasEl) canvasEl.style.cursor = "none";
    return camera;
}

function createRoot(scene) {
    const root = new BABYLON.TransformNode("root", scene);
    root.rotation.x = BABYLON.Tools.ToRadians(23.5);
    return root;
}

// ============================================================================
// === GPU POINTS MATERIAL ====================================================
// ============================================================================

function createDotMaterial(scene) {
    const mat = new BABYLON.StandardMaterial("dotMat", scene);
    mat.pointsCloud = true;        // GPU point rendering
    mat.pointSize = 1;           // Control dot size globally
    mat.disableLighting = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 255);
    return mat;
}

// ============================================================================
// === SPHERE GEOMETRY ========================================================
// ============================================================================

function createGridGeometry(scene, root) {
    const R = 1.5;
    const latSeg = 120, lonSeg = 120;
    const COUNT = (latSeg + 1) * (lonSeg + 1);

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 4);
    const rest = [], pos = [], vel = [];

    let idx = 0;
    for (let lat = 0; lat <= latSeg; lat++) {
        const phi = (lat / latSeg) * Math.PI;
        const y = Math.cos(phi);
        const r = Math.sin(phi);
        for (let lon = 0; lon <= lonSeg; lon++, idx++) {
            const theta = (lon / lonSeg) * 2 * Math.PI;
            const p = new BABYLON.Vector3(r * Math.cos(theta) * R, y * R, r * Math.sin(theta) * R);
            rest[idx] = p.clone();
            pos[idx] = p.clone();
            vel[idx] = BABYLON.Vector3.Zero();

            const k = idx * 3;
            positions[k] = p.x;
            positions[k + 1] = p.y;
            positions[k + 2] = p.z;
            const c = idx * 4;
            colors[c] = colors[c + 1] = colors[c + 2] = 1;
            colors[c + 3] = 1;
        }
    }

    const mesh = new BABYLON.Mesh("gridSphere", scene);
    mesh.setParent(root);

    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.colors = colors;
    vData.applyToMesh(mesh, true);

    mesh.material = createDotMaterial(scene);

    return { R, rest, pos, vel, positions, colors, COUNT, latSeg, lonSeg, mesh };
}

// ============================================================================
// === LINE GRID =============================================================
// ============================================================================

function createLineGrid(scene, root, rest, latSeg, lonSeg) {
    const connections = [];
    for (let lat = 0; lat < latSeg; lat++) {
        for (let lon = 0; lon < lonSeg; lon++) {
            const i0 = lat * (lonSeg + 1) + lon;
            const i1 = i0 + 1;
            const i2 = i0 + (lonSeg + 1);
            const i3 = i2 + 1;
            connections.push([i0, i1]);
            connections.push([i0, i2]);
            if (lat === latSeg - 1) connections.push([i2, i3]);
            if (lon === lonSeg - 1) connections.push([i1, i3]);
        }
    }

    const initLines = connections.map(([a, b]) => [rest[a].clone(), rest[b].clone()]);
    const lineSys = BABYLON.MeshBuilder.CreateLineSystem("grid", {
        lines: initLines,
        updatable: true,
        useVertexAlpha: true,
    }, scene);
    lineSys.color = new BABYLON.Color3(1, 1, 1);
    lineSys.alpha = 0.15;
    lineSys.setParent(root);

    return { lineSys, connections };
}

// ============================================================================
// === BRUSH =================================================================
// ============================================================================

function createBrush(scene, root) {
    const brush = BABYLON.MeshBuilder.CreateSphere("brush", { diameter: 0.12 }, scene);
    const mat = new BABYLON.StandardMaterial("brushMat", scene);
    mat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1.0);
    mat.alpha = 0.9;
    brush.material = mat;
    brush.setParent(root);
    brush.isVisible = false; // hide brush
    return brush;
}

// ============================================================================
// === INTERACTIONS / PHYSICS ================================================
// ============================================================================

function setupInteractions(scene, camera, root, brush, geom, lineSys, connections) {
    const { R, rest, pos, vel, positions, mesh, COUNT } = geom;
    const engine = scene.getEngine();

    const EPS = 0.08;
    const brushLocal = new BABYLON.Vector3();
    let hasPointer = false;
    let lastHit = new BABYLON.Vector3(0, R + EPS, 0);
    const canvasEl = engine.getRenderingCanvas();

    canvasEl?.addEventListener("mouseenter", () => (hasPointer = true));
    canvasEl?.addEventListener("mouseleave", () => (hasPointer = false));

    // Ripple effect trigger
    const ripples = [];
    const RIPPLE_COUNT = 50;
    const RIPPLE_RADIUS = 0.45;
    const RIPPLE_STRENGTH = 48;
    const RIPPLE_DECAY = 0.755;

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            ripples.length = 0;
            for (let i = 0; i < RIPPLE_COUNT; i++) {
                ripples.push({
                    pos: rest[(Math.random() * rest.length) | 0].clone(),
                    phase: Math.random() * Math.PI * 2,
                    strength: RIPPLE_STRENGTH,
                    t: 0,
                });
            }
        }
    });

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

    const ROT_SPEED = BABYLON.Tools.ToRadians(1.0);
    const tmp1 = new BABYLON.Vector3();
    const tmp2 = new BABYLON.Vector3();
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 4, BR = 0.45, BS = 8, PUSH = 10;
    const MAX_CURSOR_GAP_PX = 180;

    let cursorHidden = false; // keep track of cursor visibility state

    const canvas = engine.getRenderingCanvas();
    canvas?.addEventListener("mousemove", () => {
        if (cursorHidden) canvas.style.cursor = "none";
    });

    scene.registerBeforeRender(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        root.rotation.y += dt * ROT_SPEED;

        // Brush tracking
        if (hasPointer) {
            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const inv = root.getWorldMatrix().invert();
            const oL = BABYLON.Vector3.TransformCoordinates(ray.origin, inv);
            const dL = BABYLON.Vector3.TransformNormal(ray.direction, inv).normalize();
            const t = raySphereNearestT(oL, dL, R);
            let hitL;
            if (t !== null) hitL = oL.add(dL.scale(t));
            else hitL = oL.add(dL.scale(-BABYLON.Vector3.Dot(oL, dL))).normalize().scale(R);
            lastHit.copyFrom(hitL);
            brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
        } else {
            brushLocal.copyFrom(lastHit);
        }

        brush.position.copyFrom(brushLocal);

        // Brush active range
        let active = false;
        if (hasPointer) {
            const renderW = engine.getRenderWidth();
            const renderH = engine.getRenderHeight();
            const brush2D = BABYLON.Vector3.Project(
                brush.getAbsolutePosition(),
                BABYLON.Matrix.Identity(),
                scene.getTransformMatrix(),
                camera.viewport.toGlobal(renderW, renderH)
            );
            const dx = scene.pointerX - brush2D.x;
            const dy = scene.pointerY - brush2D.y;
            const gap = Math.sqrt(dx * dx + dy * dy);
            active = gap < MAX_CURSOR_GAP_PX;
            // === Hide / show the OS cursor depending on distance ===
            const canvas = engine.getRenderingCanvas();
            if (canvas) {
                // hide when entering zone
                if (active && !cursorHidden) {
                    canvas.style.cursor = "none";
                    cursorHidden = true;
                }
                // show again when leaving
                else if (!active && cursorHidden) {
                    canvas.style.cursor = "default";
                    cursorHidden = false;
                }
            }
        }


        // Ripple decay
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.t += dt;
            r.strength *= RIPPLE_DECAY;
            if (r.strength < 0.05) ripples.splice(i, 1);
        }

        // Physics update
        const rippleCount = ripples.length;
        const rippleActive = rippleCount > 0;
        const skipRippleUpdate = performance.now() % 2;

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
                if (dist < BR) {
                    const fall = (1 - dist / BR) ** 2;
                    tmp1.addInPlace(p.normalizeToNew().scale(PUSH * BS * fall));
                }
            }

            // Ripple influence
            if (rippleActive && !skipRippleUpdate) {
                let fx = 0, fy = 0, fz = 0;
                for (let j = 0; j < rippleCount; j++) {
                    const r = ripples[j];
                    const dx = p.x - r.pos.x;
                    const dy = p.y - r.pos.y;
                    const dz = p.z - r.pos.z;
                    const d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < RIPPLE_RADIUS * RIPPLE_RADIUS) {
                        const d = Math.sqrt(d2);
                        const amp = Math.sin(d * 10 - r.t * 15 + r.phase) * r.strength * (1 - d / RIPPLE_RADIUS);
                        const invLen = 1 / (rLen + 1e-6);
                        fx += p.x * invLen * amp;
                        fy += p.y * invLen * amp;
                        fz += p.z * invLen * amp;
                    }
                }
                v.x += fx * dt;
                v.y += fy * dt;
                v.z += fz * dt;
            }

            // Integrate motion
            v.addInPlace(tmp1.scale(dt));
            if (v.lengthSquared() > MAX * MAX) v.normalize().scaleInPlace(MAX);
            p.addInPlace(v.scale(dt));

            const k = i * 3;
            positions[k] = p.x;
            positions[k + 1] = p.y;
            positions[k + 2] = p.z;
        }

        // Update GPU vertex buffer
        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, false);

        // Lines update (every 3 frames)
        if (Math.floor(performance.now() / 16) % 3 === 0) {
            lineSys.updateMeshPositions((lp) => {
                let ptr = 0;
                for (let e = 0; e < connections.length; e++) {
                    const [ai, bi] = connections[e];
                    const pa = pos[ai], pb = pos[bi];
                    lp[ptr++] = pa.x;
                    lp[ptr++] = pa.y;
                    lp[ptr++] = pa.z;
                    lp[ptr++] = pb.x;
                    lp[ptr++] = pb.y;
                    lp[ptr++] = pb.z;
                }
            }, false);
        }
    });
}
