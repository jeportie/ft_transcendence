2// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   runMenuSphere.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:48:18 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:01:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// | Responsibility        | Description                                                       |
// | --------------------- | ----------------------------------------------------------------- |
// | **Bootloader**        | Create Babylon engine, scene, overlay                             |
// | **State Manager**     | Track app/page/UI state                                           |
// | **Event Router**      | Listen to UI & navigation events                                  |
// | **Action Dispatcher** | Run animations or visual responses                                |
// | **Metadata Hub**      | Maintain link between HTML elements, 3D anchors, overlay elements |
// | **Bridge Manager**    | Control 2D overlay and DOM parsing integration                    |
// | **Public API**        | Expose control methods for other scripts or routes                |

import * as BABYLON from "babylonjs";
import { MenuSphere } from "../core/MenuSphere.js";
import { OverlayBridge } from "../core/OverlayBridge.js";
import { EventBus } from "./EventBus.js";
import { InputController } from "./InputController.js";

export function runMenuSphere(selector = "#menu-canvas") {
    const canvas = document.querySelector(selector);
    if (!canvas) {
        console.warn(`[Babylon] Canvas not found: ${selector}`);
        return;
    }

    // --- Create engine
    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });

    // --- Subsystems
    const bus = new EventBus();
    const overlay = new OverlayBridge(canvas);
    const sphere = new MenuSphere(engine, bus);
    const input = new InputController(canvas, bus);

    // --- Wire events
    bus.on("key:press", (key) => sphere.handleKey(key));
    bus.on("mouse:move", (e) => sphere.handleMouse(e));

    // --- Main loop
    engine.runRenderLoop(() => {
        sphere.update();
        sphere.render();
        overlay.render(sphere);
    });

    // --- Resize / cleanup
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
        engine.stopRenderLoop();
        sphere.dispose();
        overlay.dispose();
        engine.dispose();
        window.removeEventListener("resize", onResize);
    };
}

