// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   SceneFactory.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 12:02:57 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:39:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export function createBaseScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.15, 0.15, 0.17);
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.4, 1, -0.3), scene);

    // --- Gradient background layer
    const layer = new BABYLON.Layer("bg", null, scene, true);
    layer.isBackground = true;

    const colorTop = "#0b0f16";
    const colorBottom = "#3f0f0b";
    const tex = new BABYLON.DynamicTexture("bgTex", { width: 512, height: 512 }, scene, false);
    const ctx = tex.getContext();
    layer.texture = tex;

    function drawGradient(shift = 0) {
        const { width: w, height: h } = tex.getSize();
        const g = ctx.createLinearGradient(0, 0, 0, h);
        const topShift = 0.05 * (1 + shift * 0.1);
        const bottomShift = 0.05 * (1 - shift * 0.1);
        g.addColorStop(0 + topShift, colorTop);
        g.addColorStop(1 - bottomShift, colorBottom);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        tex.update();
    }

    drawGradient(0);
    let smoothShift = 0;
    scene.onBeforeRenderObservable.add(() => {
        const cam = scene.activeCamera;
        if (!cam) return;
        const targetShift = Math.cos(cam.beta);
        smoothShift += (targetShift - smoothShift) * 0.05;
        drawGradient(smoothShift);
    });

    engine.onResizeObservable.add(() => tex.scaleTo(engine.getRenderWidth(), engine.getRenderHeight()));
    return scene;
}

export function createCamera(scene) {
    const canvas = scene.getEngine().getRenderingCanvas();
    const cam = new BABYLON.ArcRotateCamera(
        "cam",
        0,
        BABYLON.Tools.ToRadians(50),
        6,
        BABYLON.Vector3.Zero(),
        scene
    );
    cam.attachControl(canvas, true);
    cam.wheelPrecision = 30;

    // match old behavior
    if (canvas) canvas.style.cursor = "none";

    return cam;
}


export function createRoot(scene) {
    const root = new BABYLON.TransformNode("root", scene);
    root.rotation.x = BABYLON.Tools.ToRadians(23.5);
    return root;
}
