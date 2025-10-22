// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   test.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/22 11:38:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 15:25:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

let ROT_SPEED = BABYLON.Tools.ToRadians(1);

export const createScene = (engine) => {
    const scene = createBaseScene(engine);

    const camera = createCamera(scene);
    const root = createRoot(scene);

    const geom = createGridGeometry(scene, root); // { R, rest, pos, vel, positions, colors, COUNT, latSeg, lonSeg, mesh }

    const patterns = ["ico", "fibonacci", "spiral", "noise", "latlon"];
    let current = 0;

    window.addEventListener("keydown", (e) => {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < patterns.length) {
            current = idx;
            geom.mesh.dispose(); // remove old mesh
            const newGeom = createGridGeometry(scene, root, patterns[current]);
            Object.assign(geom, newGeom); // replace internal data
            console.log(`[Pattern] Switched to: ${patterns[current]}`);
        }
    });
    const brush = createBrush(scene, root);

    setupInteractions(scene, camera, root, brush, geom);

    return scene;
};


// ============================================================================
// === PATTERN GENERATORS =====================================================
// ============================================================================

function generatePattern(name, R, count, scene) {
    const pts = [];

    switch (name) {
        // --- 1. Icosphere pattern ---
        case "ico": {
            const temp = BABYLON.MeshBuilder.CreateIcoSphere("icoTemp", {
                radius: R,
                subdivisions: 40,
            }, scene);
            const positions = temp.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            temp.dispose();
            ROT_SPEED = BABYLON.Tools.ToRadians(1);
            for (let i = 0; i < positions.length; i += 3)
                pts.push(new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]));
            break;
        }

        // --- 2. Fibonacci sphere ---
        case "fibonacci": {
            const offset = 2 / count;
            const inc = Math.PI * (3 - Math.sqrt(5));
            for (let i = 0; i < count; i++) {
                const y = ((i * offset) - 1) + offset / 2;
                const r = Math.sqrt(1 - y * y);
                const phi = i * inc;
                const x = Math.cos(phi) * r;
                const z = Math.sin(phi) * r;
                pts.push(new BABYLON.Vector3(x * R, y * R, z * R));
                ROT_SPEED = BABYLON.Tools.ToRadians(1);
            }
            break;
        }

        // --- 3. Spiral galaxy ---
        case "spiral": {
            const turns = 1024; // number of spiral turns
            for (let i = 0; i < count; i++) {
                const t = i / count;
                const y = R * (1 - 2 * t);        // full vertical coverage
                const radius = Math.sqrt(R * R - y * y);
                const angle = t * Math.PI * 2 * turns;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                pts.push(new BABYLON.Vector3(x, y, z));
                ROT_SPEED = BABYLON.Tools.ToRadians(1);
            }
            break;
        }

        // --- 4. Noisy organic ---
        case "noise": {
            for (let i = 0; i < count * 2; i++) {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.cos(phi);
                const z = Math.sin(phi) * Math.sin(theta);
                const noise = (Math.random() - 0.5) * 0.2;
                pts.push(new BABYLON.Vector3(x * (R + noise), y * (R + noise), z * (R + noise)));
                ROT_SPEED = BABYLON.Tools.ToRadians(50);
            }
            break;
        }

        // --- 5. Lat/Lon grid pattern ---
        case "latlon": {
            const latSeg = 180, lonSeg = 180;
            for (let lat = 0; lat <= latSeg; lat++) {
                const phi = (lat / latSeg) * Math.PI;
                const y = Math.cos(phi);
                const r = Math.sin(phi);
                for (let lon = 0; lon <= lonSeg; lon++) {
                    const theta = (lon / lonSeg) * 2 * Math.PI;
                    const x = r * Math.cos(theta);
                    const z = r * Math.sin(theta);
                    pts.push(new BABYLON.Vector3(x * R, y * R, z * R));
                }
            }
            pts.latSeg = latSeg;
            pts.lonSeg = lonSeg;
            ROT_SPEED = BABYLON.Tools.ToRadians(25);
            break;
        }
    }

    return pts;
}

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
        const g = ctx.createLinearGradient(0, 0, 0, h);  // <--- ADD THIS
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
    mat.pointSize = 2;           // Control dot size globally
    mat.disableLighting = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 255);
    return mat;
}

// ============================================================================
// === SPHERE GEOMETRY ========================================================
// ============================================================================

function createGridGeometry(scene, root, pattern = "ico") {
    const R = 1.5;
    const COUNT = 15000; // for fibonacci/poisson/noise; ico will override
    const points = generatePattern(pattern, R, COUNT, scene);

    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 4);
    const rest = [], pos = [], vel = [];

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        rest[i] = p.clone();
        pos[i] = p.clone();
        vel[i] = BABYLON.Vector3.Zero();

        const k = i * 3;
        positions[k] = p.x;
        positions[k + 1] = p.y;
        positions[k + 2] = p.z;
        const c = i * 4;
        colors[c] = colors[c + 1] = colors[c + 2] = 1;
        colors[c + 3] = 1;
    }

    const mesh = new BABYLON.Mesh(`sphere_${pattern}`, scene);
    mesh.setParent(root);
    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.colors = colors;
    vData.applyToMesh(mesh, true);
    mesh.material = createDotMaterial(scene);

    console.log(`[Pattern] Generated ${points.length} points (${pattern})`);
    return { R, rest, pos, vel, positions, colors, COUNT: points.length, mesh };
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


function setupInteractions(scene, camera, root, brush, geom) {
    const engine = scene.getEngine();

    const EPS = 0.08;
    const brushLocal = new BABYLON.Vector3();
    let hasPointer = false;
    let lastHit = new BABYLON.Vector3(0, geom.R + EPS, 0);
    const canvasEl = engine.getRenderingCanvas();

    // Track pointer presence
    canvasEl?.addEventListener("mouseenter", () => (hasPointer = true));
    canvasEl?.addEventListener("mouseleave", () => (hasPointer = false));

    // Ripple parameters
    const ripples = [];
    const RIPPLE_COUNT = 20;
    const RIPPLE_RADIUS = 0.55;
    const RIPPLE_STRENGTH = 60;
    const RIPPLE_DECAY = 0.855;

    // Trigger ripples on spacebar
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            const rest = geom.rest;
            if (!rest || rest.length === 0) return;
            ripples.length = 0;
            for (let i = 0; i < RIPPLE_COUNT; i++) {
                const p = rest[(Math.random() * rest.length) | 0];
                ripples.push({
                    pos: p.clone(),
                    phase: Math.random() * Math.PI * 2,
                    strength: RIPPLE_STRENGTH,
                    t: 0,
                });
            }
        }
    });

    // Helper: ray-sphere intersection
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

    // Physics constants
    const tmp1 = new BABYLON.Vector3();
    const tmp2 = new BABYLON.Vector3();
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 4;
    const BR = 0.45, BS = 8, PUSH = 10;
    const MAX_CURSOR_GAP_PX = 180;

    let cursorHidden = false;

    canvasEl?.addEventListener("mousemove", () => {
        if (cursorHidden) canvasEl.style.cursor = "none";
    });

    let frame = 0;

    scene.registerBeforeRender(() => {
        frame++;
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        root.rotation.y += dt * ROT_SPEED;

        const R = geom.R;
        const rest = geom.rest;
        const pos = geom.pos;
        const vel = geom.vel;
        const positions = geom.positions;
        const colors = geom.colors;
        const mesh = geom.mesh;
        const COUNT = geom.COUNT;

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
            lastHit.copyFrom(hitL);
            brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
        } else {
            brushLocal.copyFrom(lastHit);
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
            active = gap < MAX_CURSOR_GAP_PX;

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
            r.strength *= RIPPLE_DECAY;
            if (r.strength < 0.05) ripples.splice(i, 1);
        }

        const rippleActive = ripples.length > 0;
        const skipRippleUpdate = performance.now() % 2;

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
                if (dist < BR) {
                    const fall = (1 - dist / BR) ** 2;
                    tmp1.addInPlace(p.normalizeToNew().scale(PUSH * BS * fall));
                }
            }

            // Ripple influence
            if (rippleActive && !skipRippleUpdate) {
                let fx = 0, fy = 0, fz = 0;
                for (let j = 0; j < ripples.length; j++) {
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



        // === Depth fade + point size from visible-face origin (correct face & space) ===

        // Push control: + moves the origin toward the camera (outside the sphere),
        //               - moves it inside the sphere along the same axis
        const DEPTH_OFFSET = 0.3; // try 0.0, 0.5, -0.5

        // 1) FRONT point on the sphere along the camera axis (world space)
        const toCamDir = camera.position.subtract(camera.target).normalize(); // target -> camera
        const depthOriginWorld = camera.target.add(toCamDir.scale(geom.R + DEPTH_OFFSET));

        // 2) Convert to root-LOCAL space to match 'positions' (which are root-local)
        const invRoot = root.getWorldMatrix().clone().invert();
        const depthOrigin = BABYLON.Vector3.TransformCoordinates(depthOriginWorld, invRoot);

        // Visual tuning (independent of zoom)
        const minDist = 0.0;  // distance at the origin point
        const maxDist = 7.0;  // how far the fade stretches

        // size contrast
        const nearSize = 3.5; // front
        const farSize = 0.05; // back

        // color contrast
        const nearColor = 1.5;  // white (front)
        const farColor = 0.01; // dark (back)

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
