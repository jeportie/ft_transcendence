// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   full-sphere-3d.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/20 15:36:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/20 15:44:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // === BACKGROUND GRADIENT ===
    scene.clearColor = new BABYLON.Color3(0.02, 0.02, 0.05);
    const gradient = new BABYLON.Layer("gradient", null, scene, true);
    gradient.isBackground = true;
    gradient.onBeforeRenderObservable.add(() => {
        const ctx = gradient._context;
        if (!ctx) return;
        const canvas = ctx.canvas;
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, "#0b0f16");
        g.addColorStop(1, "#05070b");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // === CAMERA ===
    const camera = new BABYLON.ArcRotateCamera(
        "cam",
        BABYLON.Tools.ToRadians(0),
        BABYLON.Tools.ToRadians(60),
        6,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 30;
    engine.getRenderingCanvas().style.cursor = "none";

    // === ROOT ===
    const root = new BABYLON.TransformNode("root", scene);
    root.rotation.x = BABYLON.Tools.ToRadians(23.5);
    const ROT_SPEED = BABYLON.Tools.ToRadians(1.0);
    let tAccum = 0;

    // === SHADERS ===
    BABYLON.Effect.ShadersStore["dotsVertexShader"] = `
    precision highp float;
    attribute vec3 position;
    attribute vec4 color;
    uniform mat4 worldViewProjection;
    uniform float pointSize;
    varying vec4 vColor;
    varying vec3 vPos;
    void main(void){
      vec4 worldPos = worldViewProjection * vec4(position,1.0);
      gl_Position = worldPos;
      float size = pointSize / gl_Position.w;
      gl_PointSize = size;
      vPos = normalize(position);
      vColor = color;
    }
  `;
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

    // === GRID GEOMETRY ===
    const R = 1.5;
    const latSeg = 120, lonSeg = 180;
    const COUNT = (latSeg + 1) * (lonSeg + 1);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 4);
    const rest = [], pos = [], vel = [];

    let idx = 0;
    for (let lat = 0; lat <= latSeg; lat++) {
        const phi = (lat / latSeg) * Math.PI;
        const y = Math.cos(phi);
        const r = Math.sin(phi);
        for (let lon = 0; lon <= lonSeg; lon++) {
            const theta = (lon / lonSeg) * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const p = new BABYLON.Vector3(x * R, y * R, z * R);
            rest[idx] = p.clone();
            pos[idx] = p.clone();
            vel[idx] = BABYLON.Vector3.Zero();
            const k = idx * 3;
            positions[k] = p.x; positions[k + 1] = p.y; positions[k + 2] = p.z;
            const c = idx * 4;
            colors[c] = colors[c + 1] = colors[c + 2] = 1; colors[c + 3] = 1;
            idx++;
        }
    }

    // === PARTICLE MESH ===
    const mesh = new BABYLON.Mesh("gridSphere", scene);
    mesh.setParent(root);
    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.colors = colors;
    vData.applyToMesh(mesh, true);

    const mat = new BABYLON.ShaderMaterial("dotMat", scene, { vertex: "dots", fragment: "dots" }, {
        attributes: ["position", "color"],
        uniforms: ["worldViewProjection", "pointSize"],
    });
    mat.pointsCloud = true;
    mat.disableLighting = true;
    mat.setFloat("pointSize", 2.0);
    mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    mesh.material = mat;

    // === GRID LINKS ===
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
    lineSys.alpha = 0.2;
    lineSys.setParent(root);

    // === BRUSH INTERACTION ===
    const brushLocal = new BABYLON.Vector3();
    const EPS = 0.08;
    let hasPointer = false;
    let lastHit = new BABYLON.Vector3(0, R + EPS, 0);
    const canvasEl = engine.getRenderingCanvas();
    canvasEl.addEventListener("mouseenter", () => hasPointer = true);
    canvasEl.addEventListener("mouseleave", () => hasPointer = false);

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

    // === PHYSICS PARAMETERS ===
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 2.5, BR = 0.45, BS = 10, PUSH = 3;
    const tmp1 = new BABYLON.Vector3(), tmp2 = new BABYLON.Vector3();

    // === RIPPLE SYSTEM ===
    const ripples = [];
    const RIPPLE_COUNT = 15;
    const RIPPLE_RADIUS = 0.35;
    const RIPPLE_STRENGTH = 30;
    const RIPPLE_DECAY = 0.975;
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

    // === LOOP ===
    scene.registerBeforeRender(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        tAccum += dt;
        root.rotation.y = tAccum * ROT_SPEED;

        // Brush tracking
        if (hasPointer) {
            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const inv = root.getWorldMatrix().clone().invert();
            const oL = BABYLON.Vector3.TransformCoordinates(ray.origin, inv);
            const dL = BABYLON.Vector3.TransformNormal(ray.direction, inv).normalize();
            let t = raySphereNearestT(oL, dL, R);
            let hitL;
            if (t !== null) hitL = oL.add(dL.scale(t));
            else {
                const tC = -BABYLON.Vector3.Dot(oL, dL);
                hitL = oL.add(dL.scale(tC)).normalize().scale(R);
            }
            lastHit.copyFrom(hitL);
            brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
        } else brushLocal.copyFrom(lastHit);

        // Ripple advance
        for (const r of ripples) {
            r.t += dt;
            r.strength *= RIPPLE_DECAY;
        }
        for (let i = ripples.length - 1; i >= 0; i--) {
            if (ripples[i].strength < 0.05) ripples.splice(i, 1);
        }

        // === PHYSICS ===
        for (let i = 0; i < COUNT; i++) {
            const p = pos[i], v = vel[i], r0 = rest[i];
            const fRest = r0.subtractToRef(p, tmp1).scaleInPlace(K_REST);
            const rLen = p.length();
            const fRad = rLen > 1e-6 ? p.scale(-1 / rLen).scale((R - rLen) * K_RAD) : BABYLON.Vector3.Zero();
            const fDamp = v.scale(-DAMP);

            // Brush
            let fBrush = BABYLON.Vector3.Zero();
            const toB = brushLocal.subtractToRef(p, tmp2);
            const dist = toB.length();
            if (dist < BR) {
                const t = 1 - dist / BR;
                const fall = t * t;
                const n = p.normalizeToNew();
                fBrush = n.scale(PUSH * BS * fall);
            }

            // Ripples
            let fRipple = BABYLON.Vector3.Zero();
            for (const r of ripples) {
                const d = BABYLON.Vector3.Distance(p, r.pos);
                if (d < RIPPLE_RADIUS) {
                    const n = p.normalizeToNew();
                    const amp = Math.sin(d * 10 - r.t * 15 + r.phase) * r.strength * (1 - d / RIPPLE_RADIUS);
                    fRipple.addInPlace(n.scale(amp));
                }
            }

            v.addInPlace(fRest.add(fRad).add(fDamp).add(fBrush).add(fRipple).scale(dt));
            if (v.lengthSquared() > MAX * MAX) v.normalize().scaleInPlace(MAX);
            p.addInPlace(v.scale(dt));

            const k = i * 3;
            positions[k] = p.x; positions[k + 1] = p.y; positions[k + 2] = p.z;
        }

        // === GPU Updates ===
        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);

        // === Efficient line update ===
        lineSys.updateMeshPositions((lp) => {
            let ptr = 0;
            for (let e = 0; e < connections.length; e++) {
                const [ai, bi] = connections[e];
                const pa = pos[ai];
                const pb = pos[bi];
                lp[ptr++] = pa.x;
                lp[ptr++] = pa.y;
                lp[ptr++] = pa.z;
                lp[ptr++] = pb.x;
                lp[ptr++] = pb.y;
                lp[ptr++] = pb.z;
            }
        }, false);
    });

    return scene;
};
