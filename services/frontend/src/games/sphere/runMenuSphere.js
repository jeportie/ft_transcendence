// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   runMenuSphere.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 11:59:14 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 13:31:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";
// import { createScene } from "./menu_sphere.js";
// import { createScene } from "./particle-sphere.js";
import { createScene } from "./test.js";
// import { createScene } from "./latitudeSystem.js";

export function runMenuSphere(selector = "#menu-canvas") {
    const canvas = document.querySelector(selector);
    if (!canvas) {
        console.warn(`[Babylon] Canvas not found: ${selector}`);
        return;
    }

    if (canvas.__menuSphere?.engine && !canvas.__menuSphere.engine.isDisposed()) {
        console.log("[Babylon] 🔁 Reusing existing engine");
        return canvas.__menuSphere.cleanup;
    }

    // ✅ Idempotent: if already running on this canvas, don’t rebuild the scene
    if (canvas.__menuSphere?.engine && !canvas.__menuSphere.engine.isDisposed()) {
        return canvas.__menuSphere.cleanup; // return the existing cleanup
    }

    // --- Try to get WebGL context manually first
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
        console.error("[Babylon] ❌ WebGL not supported on this device or browser.");
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#222";
            ctx.font = "16px monospace";
            ctx.fillText("⚠️ WebGL not supported", 10, 30);
        }
        return;
    }

    // --- Create Babylon engine safely
    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
    });

    // --- Create and render scene
    const scene = createScene(engine);
    const onResize = () => engine.resize();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", onResize);

    // --- Cleanup
    const cleanup = () => {
        engine.stopRenderLoop();
        scene.dispose();
        engine.dispose();
        window.removeEventListener("resize", onResize);
        if (canvas.__menuSphere) delete canvas.__menuSphere;
    };

    // stash on the canvas so re-mounts can reuse/skip
    canvas.__menuSphere = { engine, scene, cleanup };
    return cleanup;
}

