// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   menu_sphere.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 11:49:27 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 13:11:10 by jeportie         ###   ########.fr       //
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

function createBaseScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.15, 0.15, 0.17); // solid clear; alpha optional

    // Make a DynamicTexture-backed Layer for the background gradient
    const layer = new BABYLON.Layer("bg", null, scene, true);
    layer.isBackground = true;

    // Create a dynamic texture that matches the canvas size
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

    // Initial paint
    layer.texture = makeGradientTexture();

    // Repaint on resize so the gradient matches the new size
    engine.onResizeObservable.add(() => {
        layer.texture?.dispose();
        layer.texture = makeGradientTexture();
    });

    // (Optional) light — has no effect on your ShaderMaterial points, safe to remove
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

function ensureDotShaders(scene) {
    if (!BABYLON.Effect.ShadersStore["dotsVertexShader"]) {
        BABYLON.Effect.ShadersStore["dotsVertexShader"] = `
      precision highp float;
      attribute vec3 position;
      attribute vec4 color;
      uniform mat4 worldViewProjection;
      uniform float pointSize;
      varying vec4 vColor;
      varying vec3 vPos;
      void main(void){
        gl_Position = worldViewProjection * vec4(position,1.0);
        gl_PointSize = pointSize / gl_Position.w;
        vPos = normalize(position);
        vColor = color;
      }
    `;
    }
    if (!BABYLON.Effect.ShadersStore["dotsFragmentShader"]) {
        BABYLON.Effect.ShadersStore["dotsFragmentShader"] = `
      precision highp float;
      varying vec4 vColor;
      varying vec3 vPos;
      void main(void){
        vec2 d = gl_PointCoord - vec2(0.5);
        float dist = length(d);
        if(dist>0.5) discard;
        float alpha = smoothstep(0.5,0.45,dist);
        vec3 lightDir = normalize(vec3(0.5,1.0,-0.3));
        float light = clamp(dot(vPos,lightDir)*0.5+0.5,0.0,1.0);
        vec3 shaded = mix(vColor.rgb*0.35, vColor.rgb, light);
        gl_FragColor = vec4(shaded, vColor.a*alpha);
      }
    `;
    }
}

function createDotMaterial(scene) {
    ensureDotShaders(scene);
    const mat = new BABYLON.ShaderMaterial("dotMat", scene, { vertex: "dots", fragment: "dots" }, {
        attributes: ["position", "color"],
        uniforms: ["worldViewProjection", "pointSize"],
    });
    // mat.pointsCloud = true;           // <--- ADD THIS
    mat.disableLighting = true;
    mat.setFloat("pointSize", 4.0);
    // mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    return mat;
}

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
            positions[k] = p.x; positions[k + 1] = p.y; positions[k + 2] = p.z;
            const c = idx * 4;
            colors[c] = colors[c + 1] = colors[c + 2] = 1; colors[c + 3] = 1;
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

// function createLineGrid(scene, root, rest, latSeg, lonSeg) {
//     const connections = [];
//     for (let lat = 0; lat < latSeg; lat++) {
//         for (let lon = 0; lon < lonSeg; lon++) {
//             const i0 = lat * (lonSeg + 1) + lon;
//             const i1 = i0 + 1;
//             const i2 = i0 + (lonSeg + 1);
//             const i3 = i2 + 1;
//             connections.push([i0, i1]);
//             connections.push([i0, i2]);
//             if (lat === latSeg - 1) connections.push([i2, i3]);
//             if (lon === lonSeg - 1) connections.push([i1, i3]);
//         }
//     }
//
//     const initLines = connections.map(([a, b]) => [rest[a].clone(), rest[b].clone()]);
//     const lineSys = BABYLON.MeshBuilder.CreateLineSystem("grid", {
//         lines: initLines,
//         updatable: true,
//         useVertexAlpha: true,
//     }, scene);
//     lineSys.color = new BABYLON.Color3(1, 1, 1);
//     lineSys.alpha = 0.15;
//     lineSys.setParent(root);
//
//     return { lineSys, connections };
// }

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
    lineSys.setParent(root);

    // === DEPTH-FADE LINE MATERIAL ===


    BABYLON.Effect.ShadersStore["depthlineVertexShader"] = `
    precision highp float;
    attribute vec3 position;
    uniform mat4 worldViewProjection;
    uniform float time;
    varying vec3 vPos;
    void main(void){
        vPos = position;
        gl_Position = worldViewProjection * vec4(position, 1.0);
        gl_Position.z += 0.002 * gl_Position.w; // depth offset
    }
    `;

    BABYLON.Effect.ShadersStore["depthlineFragmentShader"] = `
    precision highp float;
    uniform vec3 cameraPosition;
    uniform float time;
    varying vec3 vPos;
    vec3 rgb(float r, float g, float b){ return vec3(r/255.0, g/255.0, b/255.0); }
    void main(void){
        vec3 N = normalize(vPos);
        vec3 V = normalize(cameraPosition - vPos);
        float facing = dot(N, V);
        float alpha = smoothstep(-0.2, 0.4, facing);
        alpha = pow(alpha, 2.0);
        // deformation (distance from rest radius 1.5)
        float deform = abs(length(vPos) - 1.5);
        // ---- color palette (cold → warm)
        vec3 c0 = rgb(147.0,197.0,253.0); // blue
        vec3 c1 = rgb(167.0,243.0,208.0); // mint
        vec3 c2 = rgb(253.0,224.0, 71.0); // yellow
        vec3 c3 = rgb(251.0,146.0, 60.0); // orange
        // smooth gradient along deform
        float t = smoothstep(0.0, 0.25, deform);
        vec3 heat = mix(c0, c1, clamp(t*2.0,0.0,1.0));
        heat = mix(heat, c2, clamp((t-0.5)*2.0,0.0,1.0));
        heat = mix(heat, c3, clamp((t-0.75)*4.0,0.0,1.0));
        // energy pulse (optional)
        float wave = sin(time * 1.5 + length(vPos) * 6.0) * 0.5 + 0.5;
        heat = mix(vec3(1.0), heat, wave * smoothstep(0.0, 0.2, deform));
        // front/back base tone (grayish)
        vec3 frontColor = vec3(0.55, 0.6, 0.65);
        vec3 backColor  = vec3(0.15, 0.10, 0.12);
        vec3 base = mix(backColor, frontColor, alpha);
        vec3 color = mix(base, heat, smoothstep(0.05, 0.25, deform));
        gl_FragColor = vec4(color, 0.3 * alpha);
    }
    `;

    // === Material setup
    const lineMat = new BABYLON.ShaderMaterial("lineMat", scene, {
        vertex: "depthline",
        fragment: "depthline",
    }, {
        attributes: ["position"],
        uniforms: ["worldViewProjection", "cameraPosition", "time"],
    });

    lineMat.backFaceCulling = false;
    lineMat.disableLighting = true;
    lineMat.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
    lineSys.material = lineMat;


    return { lineSys, connections };
}

function createBrush(scene, root) {
    const brush = BABYLON.MeshBuilder.CreateSphere("brush", { diameter: 0.12 }, scene);
    const mat = new BABYLON.StandardMaterial("brushMat", scene);
    mat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1.0);
    mat.alpha = 0.9;
    brush.material = mat;
    brush.setParent(root);

    // 🔧 Debug visibility toggle
    const DEBUG_BRUSH = false; // set true if you ever need to see it
    brush.isVisible = DEBUG_BRUSH;

    return brush;
}

function setupInteractions(scene, camera, root, brush, geom, lineSys, connections) {
    const { R, rest, pos, vel, positions, mesh, COUNT } = geom;
    const engine = scene.getEngine();

    const EPS = 0.08;
    const brushLocal = new BABYLON.Vector3();
    let hasPointer = false;
    let lastHit = new BABYLON.Vector3(0, R + EPS, 0);
    const canvasEl = engine.getRenderingCanvas();

    // --- Pointer events
    canvasEl?.addEventListener("mouseenter", () => (hasPointer = true));
    canvasEl?.addEventListener("mouseleave", () => (hasPointer = false));

    // --- Ripple system (triggered with Space)
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

    // --- Constants
    const ROT_SPEED = BABYLON.Tools.ToRadians(1.0);
    let tAccum = 0;
    let frame = 0;
    const tmp1 = new BABYLON.Vector3();
    const tmp2 = new BABYLON.Vector3();
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 4, BR = 0.45, BS = 8, PUSH = 10;
    const MAX_CURSOR_GAP_PX = 180;

    // --- Main render loop
    scene.registerBeforeRender(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        tAccum += dt;
        frame++;
        root.rotation.y = tAccum * ROT_SPEED;

        // --- Brush tracking
        if (hasPointer) {
            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const inv = root.getWorldMatrix().invert();
            const oL = BABYLON.Vector3.TransformCoordinates(ray.origin, inv);
            const dL = BABYLON.Vector3.TransformNormal(ray.direction, inv).normalize();

            const t = raySphereNearestT(oL, dL, R);
            let hitL;
            if (t !== null) hitL = oL.add(dL.scale(t));
            else {
                const tC = -BABYLON.Vector3.Dot(oL, dL);
                hitL = oL.add(dL.scale(tC)).normalize().scale(R);
            }
            lastHit.copyFrom(hitL);
            brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
        } else {
            brushLocal.copyFrom(lastHit);
        }

        brush.position.copyFrom(brushLocal);

        // --- Determine if brush is active (cursor close enough)
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
        }

        // --- Ripple decay & cleanup
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.t += dt;
            r.strength *= RIPPLE_DECAY;
            if (r.strength < 0.05) ripples.splice(i, 1);
        }

        lineSys.material.setFloat("time", performance.now() * 0.001); // For shader version of the sphere

        // --- Physics update
        const rippleCount = ripples.length;
        const rippleActive = rippleCount > 0;
        const skipRippleUpdate = frame % 2; // update every 2 frames

        for (let i = 0; i < COUNT; i++) {
            const p = pos[i], v = vel[i], r0 = rest[i];

            tmp1.copyFrom(r0).subtractInPlace(p).scaleInPlace(K_REST);
            const rLen = p.length();
            tmp2.copyFrom(p).normalize().scaleInPlace((R - rLen) * K_RAD);

            tmp1.addInPlace(tmp2);
            tmp1.addInPlace(v.scale(-DAMP));

            // --- Brush influence
            if (active) {
                const toB = brushLocal.subtract(p);
                const dist = toB.length();
                if (dist < BR) {
                    const fall = (1 - dist / BR) ** 2;
                    tmp1.addInPlace(p.normalizeToNew().scale(PUSH * BS * fall));
                }
            }

            // --- Ripple influence (optimized)
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

            // integrate motion
            v.addInPlace(tmp1.scale(dt));
            if (v.lengthSquared() > MAX * MAX) v.normalize().scaleInPlace(MAX);
            p.addInPlace(v.scale(dt));

            const k = i * 3;
            positions[k] = p.x;
            positions[k + 1] = p.y;
            positions[k + 2] = p.z;
        }

        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, false);

        // --- Lines update (every 3 frames for performance)
        if (frame % 3 === 0) {
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
