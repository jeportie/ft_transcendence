const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    /* BACKGROUND / CAMERA / LIGHT / GLOW */
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

    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.3, 1, -0.3), scene);
    const glow = new BABYLON.GlowLayer("glow", scene, { blurKernelSize: 64 });
    glow.intensity = 0.8;

    /* ROOT NODE */
    const root = new BABYLON.TransformNode("root", scene);
    root.rotation.x = BABYLON.Tools.ToRadians(23.5);
    const ROT_SPEED = BABYLON.Tools.ToRadians(1.0);
    let tAccum = 0;

    /* BRUSH CURSOR */
    const brushCursor = BABYLON.MeshBuilder.CreateSphere("brushCursor", { diameter: 0.1 }, scene);
    const brushMat = new BABYLON.StandardMaterial("brushMat", scene);
    brushMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
    brushMat.alpha = 0.9;
    brushCursor.material = brushMat;
    brushCursor.setParent(root);

    /* CONSTANTS */
    const R = 1.5;
    const latSeg = 120, lonSeg = 120;
    const COUNT = (latSeg + 1) * (lonSeg + 1);
    const rest = [], pos = [], vel = [];
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 4);

    /* SPHERE GRID */
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
            colors[c] = 1; colors[c + 1] = 1; colors[c + 2] = 1; colors[c + 3] = 1;
            idx++;
        }
    }

    /* SINGLE POINT CLOUD SYSTEM (updatable!) */
    const pcs = new BABYLON.PointsCloudSystem("pcs", 1, scene, { updatable: true });
    pcs.addPoints(COUNT, (pt, i) => {
        pt.position = rest[i].clone();
        pt.color = new BABYLON.Color4(1, 1, 1, 1);
    });

    pcs.buildMeshAsync().then(() => {
        pcs.mesh.setParent(root);
        const mat = new BABYLON.StandardMaterial("mat", scene);
        mat.disableLighting = true;
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        mat.pointsCloud = true;
        mat.pointSize = 0.0;
        pcs.mesh.material = mat;

        pcs.updateParticle = (pt, i) => {
            if (!pos[i]) return;
            pt.position.copyFrom(pos[i]);
            const ci = i * 4;
            pt.color.set(colors[ci], colors[ci + 1], colors[ci + 2], 1);
        };
        pcs.setParticles();
    });

    /* LINES */
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

    /* RAY / BRUSH INTERSECTION */
    const brushLocal = new BABYLON.Vector3();
    const EPS = 0.08;
    let hasPointer = false;
    let lastHit = new BABYLON.Vector3(0, R + EPS, 0);
    const canvasEl = engine.getRenderingCanvas();
    canvasEl.addEventListener("mouseenter", () => (hasPointer = true));
    canvasEl.addEventListener("mouseleave", () => (hasPointer = false));

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

    /* PHYSICS CONSTANTS */
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 2.5, BR = 0.45, BS = 10, PUSH = 3;
    const tmp1 = new BABYLON.Vector3(), tmp2 = new BABYLON.Vector3();

    /* RIPPLE SYSTEM */
    const ripples = [];
    const RIPPLE_COUNT = 15, RIPPLE_RADIUS = 0.35, RIPPLE_STRENGTH = 30, RIPPLE_DECAY = 0.975;
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

    /* COLOR PALETTE */
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (t) => t * t * (3 - 2 * t);
    const palette = [
        { r: 147 / 255, g: 197 / 255, b: 253 / 255 },
        { r: 167 / 255, g: 243 / 255, b: 208 / 255 },
        { r: 1.0, g: 1.0, b: 1.0 },
        { r: 253 / 255, g: 224 / 255, b: 71 / 255 },
        { r: 251 / 255, g: 146 / 255, b: 60 / 255 },
    ];

    /* BEFORE RENDER LOOP */
    scene.registerBeforeRender(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        tAccum += dt;
        root.rotation.y = tAccum * ROT_SPEED;

        // brush
        if (hasPointer) {
            const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const localRay = BABYLON.Ray.Transform(ray, root.getWorldMatrix().clone().invert());
            const t = raySphereNearestT(localRay.origin, localRay.direction, R);
            let hitL;
            if (t !== null) hitL = localRay.origin.add(localRay.direction.scale(t));
            else {
                const tC = -BABYLON.Vector3.Dot(localRay.origin, localRay.direction);
                hitL = localRay.origin.add(localRay.direction.scale(tC)).normalize().scale(R);
            }
            lastHit.copyFrom(hitL);
            brushLocal.copyFrom(hitL.normalizeToNew().scale(R + EPS));
        } else brushLocal.copyFrom(lastHit);
        brushCursor.position.copyFrom(brushLocal);

        // ripple
        for (const r of ripples) {
            r.t += dt;
            r.strength *= RIPPLE_DECAY;
        }

        // physics
        for (let i = 0; i < COUNT; i++) {
            const p = pos[i], v = vel[i], r0 = rest[i];
            const fRest = r0.subtractToRef(p, tmp1).scaleInPlace(K_REST);
            const rLen = p.length();
            const fRad = rLen > 1e-6 ? p.scale(-1 / rLen).scale((R - rLen) * K_RAD) : BABYLON.Vector3.Zero();
            const fDamp = v.scale(-DAMP);
            let fBrush = BABYLON.Vector3.Zero();
            const toB = brushLocal.subtractToRef(p, tmp2);
            const dist = toB.length();
            if (dist < BR) {
                const t = 1 - dist / BR;
                const fall = t * t;
                const n = p.normalizeToNew();
                fBrush = n.scale(PUSH * BS * fall);
            }
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
        }

        // color
        let maxDisp = 0;
        for (let i = 0; i < COUNT; i++) {
            const d = BABYLON.Vector3.Distance(pos[i], rest[i]);
            if (d > maxDisp) maxDisp = d;
        }
        const maxExpected = Math.max(0.25, maxDisp);
        for (let i = 0; i < COUNT; i++) {
            const d = BABYLON.Vector3.Distance(pos[i], rest[i]);
            let t = Math.min(d / maxExpected, 1.0);
            t = smooth(t);
            const idx = Math.min(Math.floor(t * (palette.length - 1)), palette.length - 2);
            const localT = t * (palette.length - 1) - idx;
            const c1 = palette[idx], c2 = palette[idx + 1];
            const r = lerp(c1.r, c2.r, localT);
            const g = lerp(c1.g, c2.g, localT);
            const b = lerp(c1.b, c2.b, localT);
            const ci = i * 4;
            colors[ci] = r; colors[ci + 1] = g; colors[ci + 2] = b; colors[ci + 3] = 1;
        }

        pcs.setParticles(undefined, true); // ✅ force GPU update
        lineSys.updateMeshPositions((lp) => {
            let ptr = 0;
            for (let e = 0; e < connections.length; e++) {
                const [ai, bi] = connections[e];
                const pa = pos[ai], pb = pos[bi];
                lp[ptr++] = pa.x; lp[ptr++] = pa.y; lp[ptr++] = pa.z;
                lp[ptr++] = pb.x; lp[ptr++] = pb.y; lp[ptr++] = pb.z;
            }
        }, false);
    });

    return scene;
};
