const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // === BACKGROUND GRADIENT ===
    const topColor = new BABYLON.Color3.FromHexString("#0b0f16");
    const bottomColor = new BABYLON.Color3.FromHexString("#05070b");
    scene.clearColor = bottomColor.clone();
    const gradient = new BABYLON.Layer("gradient", null, scene, true);
    gradient.isBackground = true;
    gradient.onBeforeRenderObservable.add(() => {
        const ctx = gradient._context;
        if (ctx) {
            const canvas = ctx.canvas;
            const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
            g.addColorStop(0, "#0b0f16");
            g.addColorStop(1, "#05070b");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
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
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.4, 1, -0.3), scene);
    engine.getRenderingCanvas().style.cursor = "none";

    // === ROOT ===
    const root = new BABYLON.TransformNode("root", scene);
    root.rotation.x = BABYLON.Tools.ToRadians(23.5);
    const ROT_SPEED = BABYLON.Tools.ToRadians(2);
    let tAccum = 0;

    // === SHADERS ===
    BABYLON.Effect.ShadersStore["dotsVertexShader"] = `
    precision highp float;
    attribute vec3 position;
    attribute vec4 color;
    uniform mat4 worldViewProjection;
    uniform float pointSize;
    varying vec4 vColor;
    float rand3(vec3 p){
      return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453);
    }
    void main(void){
      vColor=color;
      gl_Position=worldViewProjection*vec4(position,1.0);
      float r=rand3(position);
      gl_PointSize=pointSize*(0.6+r*0.4);
    }`;
    BABYLON.Effect.ShadersStore["dotsFragmentShader"] = `
    precision highp float;
    varying vec4 vColor;
    void main(void){
      vec2 d=gl_PointCoord-vec2(0.5);
      float dist=length(d);
      if(dist>0.5) discard;
      float alpha=smoothstep(0.5,0.45,dist);
      gl_FragColor=vec4(vColor.rgb,vColor.a*alpha);
    }`;

    // === PARTICLES ===
    const R = 1.5;
    const COUNT = 10000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 4);
    const rest = [], pos = [], vel = [];

    const randomOnSphere = (r) => {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
        return new BABYLON.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    };

    for (let i = 0; i < COUNT; i++) {
        const p0 = randomOnSphere(R);
        rest[i] = p0.clone();
        pos[i] = p0.clone();
        vel[i] = BABYLON.Vector3.Zero();
        const k = i * 3;
        positions[k] = p0.x; positions[k + 1] = p0.y; positions[k + 2] = p0.z;
        const c = i * 4;
        colors[c] = colors[c + 1] = colors[c + 2] = 1; colors[c + 3] = 1;
    }

    const mesh = new BABYLON.Mesh("pointSphere", scene);
    mesh.setParent(root);
    const vData = new BABYLON.VertexData();
    vData.positions = Array.from(positions);
    vData.colors = Array.from(colors);
    vData.applyToMesh(mesh, true);

    const mat = new BABYLON.ShaderMaterial("dotMat", scene, {
        vertex: "dots", fragment: "dots",
    }, {
        attributes: ["position", "color"],
        uniforms: ["worldViewProjection", "pointSize"],
    });
    mat.pointsCloud = true;
    mat.disableLighting = true;
    mat.setFloat("pointSize", 2.0);
    mesh.material = mat;

    // === BRUSH ===
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

    // === PHYSICS ===
    const K_REST = 90, K_RAD = 55, DAMP = 3, MAX = 2.5, BR = 0.45, BS = 10, PUSH = 2.5;
    const tmp1 = new BABYLON.Vector3(), tmp2 = new BABYLON.Vector3();

    // === LINKS ===
    const LINK_DIST = 0.08;
    const LINE_ALPHA = 0.20;
    const LINE_COLOR = new BABYLON.Color3(1, 1, 1);
    const LINK_MAX_TOTAL = 100000;
    const links = [];
    const added = new Set();
    for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
            const d2 = BABYLON.Vector3.DistanceSquared(rest[i], rest[j]);
            if (d2 <= LINK_DIST * LINK_DIST) {
                const key = `${i}-${j}`;
                if (!added.has(key)) {
                    links.push([i, j]);
                    added.add(key);
                    if (links.length >= LINK_MAX_TOTAL) break;
                }
            }
        }
        if (links.length >= LINK_MAX_TOTAL) break;
    }

    const linesVectors = links.map(() => [new BABYLON.Vector3(), new BABYLON.Vector3()]);
    const lineSystem = BABYLON.MeshBuilder.CreateLineSystem(
        "web",
        { lines: linesVectors, updatable: true, useVertexAlpha: true },
        scene
    );
    lineSystem.color = LINE_COLOR;
    lineSystem.alpha = LINE_ALPHA;
    lineSystem.isPickable = false;
    lineSystem.setParent(root);

    // === TOGGLE LINES WITH W ===
    let showLines = true;
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "w") {
            showLines = !showLines;
            lineSystem.setEnabled(showLines);
        }
    });

    // === CHAOTIC RIPPLE SYSTEM ===
    const ripples = [];
    const RIPPLE_COUNT = 20;
    const RIPPLE_RADIUS = 0.4;
    const RIPPLE_STRENGTH = 30;
    const RIPPLE_DECAY = 0.98;

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            // spawn N random ripple emitters
            ripples.length = 0;
            for (let i = 0; i < RIPPLE_COUNT; i++) {
                ripples.push({
                    pos: randomOnSphere(R + Math.random() * 0.2 - 0.1),
                    phase: Math.random() * Math.PI * 2,
                    strength: RIPPLE_STRENGTH,
                    t: 0
                });
            }
        }
    });

    // === LOOP ===
    scene.registerBeforeRender(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.033);
        tAccum += dt;
        root.rotation.y = tAccum * ROT_SPEED;

        // update ripple emitters
        for (const r of ripples) {
            r.t += dt;
            r.strength *= RIPPLE_DECAY;
            // make them move slowly over the sphere surface
            const rot = BABYLON.Quaternion.FromEulerAngles(
                dt * 0.3 * (Math.random() - 0.5),
                dt * 0.3 * (Math.random() - 0.5),
                0
            );
            r.pos.rotateByQuaternionToRef(rot, r.pos);
        }

        // === Brush logic (still active) ===
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

        // === Physics ===
        for (let i = 0; i < COUNT; i++) {
            const p = pos[i], v = vel[i], r0 = rest[i];
            const fRest = r0.subtractToRef(p, tmp1).scaleInPlace(K_REST);
            const rLen = p.length();
            const fRad = rLen > 1e-6 ? p.scale(-1 / rLen).scale((R - rLen) * K_RAD) : BABYLON.Vector3.Zero();
            const fDamp = v.scale(-DAMP);

            // --- Main mouse brush
            let fBrush = BABYLON.Vector3.Zero();
            const toB = brushLocal.subtractToRef(p, tmp2);
            const dist = toB.length();
            if (dist < BR) {
                const t = 1 - dist / BR;
                const fall = t * t;
                const n = p.normalizeToNew();
                fBrush = n.scale(PUSH * BS * fall);
            }

            // --- Multiple random ripples
            let fRipple = BABYLON.Vector3.Zero();
            for (const r of ripples) {
                const toR = r.pos.subtract(p);
                const d = toR.length();
                if (d < RIPPLE_RADIUS) {
                    const n = p.normalizeToNew();
                    const amp = Math.sin(d * 12 - r.t * 15 + r.phase) * r.strength * (1 - d / RIPPLE_RADIUS);
                    fRipple.addInPlace(n.scale(amp));
                }
            }

            // === Integrate ===
            v.addInPlace(fRest.add(fRad).add(fDamp).add(fBrush).add(fRipple).scale(dt));
            if (v.lengthSquared() > MAX * MAX) v.normalize().scaleInPlace(MAX);
            p.addInPlace(v.scale(dt));

            const k = i * 3;
            positions[k] = p.x; positions[k + 1] = p.y; positions[k + 2] = p.z;
        }

        // remove dead ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            if (ripples[i].strength < 0.05) ripples.splice(i, 1);
        }

        mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);

        // Update lines
        if (showLines) {
            for (let e = 0; e < links.length; e++) {
                const [i, j] = links[e];
                const a = linesVectors[e][0];
                const b = linesVectors[e][1];
                const ki = i * 3, kj = j * 3;
                a.x = positions[ki]; a.y = positions[ki + 1]; a.z = positions[ki + 2];
                b.x = positions[kj]; b.y = positions[kj + 1]; b.z = positions[kj + 2];
            }
            BABYLON.MeshBuilder.CreateLineSystem("web", { lines: linesVectors, instance: lineSystem });
        }
    });

    return scene;
};
