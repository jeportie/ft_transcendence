// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   runMenuSphere.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 11:59:14 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 12:51:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";
import { createScene } from "./menu_sphere.js";

export function runMenuSphere(selector = "#menu-canvas") {
    const canvas = document.querySelector(selector);
    if (!canvas) {
        console.warn(`[Babylon] Canvas not found: ${selector}`);
        return;
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
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());

    // --- Cleanup
    return () => {
        engine.stopRenderLoop();
        scene.dispose();
        engine.dispose();
        window.removeEventListener("resize", () => engine.resize());
    };
}

