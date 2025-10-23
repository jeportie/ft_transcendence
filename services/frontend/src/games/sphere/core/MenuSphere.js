// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MenuSphere.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:54:16 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:02:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";
import { createBaseScene, createCamera, createRoot } from "./SceneFactory.js";
import { createGridGeometry } from "./GeometryFactory.js";
import { createBrush } from "./Brush.js";
import { PhysicsEngine } from "./PhysicsEngine.js";

export class MenuSphere {
    constructor(engine, bus, opts = {}) {
        this.engine = engine;
        this.bus = bus;
        this.opts = { pattern: "ico", ...opts };

        // --- Scene setup
        this.scene = createBaseScene(engine);
        this.camera = createCamera(this.scene);
        this.root = createRoot(this.scene);

        // --- Geometry + brush + physics
        this.geom = createGridGeometry(this.scene, this.root, this.opts.pattern);
        this.brush = createBrush(this.scene, this.root);
        this.physics = new PhysicsEngine(this.scene, this.camera, this.root, this.brush, this.geom);

        // --- Key map
        this.patterns = ["ico", "fibonacci", "spiral", "noise", "latlon"];
    }

    handleKey(key) {
        const idx = parseInt(key) - 1;
        if (idx >= 0 && idx < this.patterns.length) {
            this.geom.mesh.dispose();
            const newGeom = createGridGeometry(this.scene, this.root, this.patterns[idx]);
            Object.assign(this.geom, newGeom);
            console.log(`[Pattern] Switched to: ${this.patterns[idx]}`);
        }
        if (key === " ") this.physics.triggerRipple();
    }

    handleMouse(e) {
        this.physics.handleMouse(e);
    }

    update() { } // updates handled inside physics
    render() { this.scene.render(); }
    dispose() { this.scene.dispose(); }
}

