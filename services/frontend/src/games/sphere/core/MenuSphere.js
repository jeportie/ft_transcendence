// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MenuSphere.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:54:16 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 16:12:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";
import { createBaseScene, createCamera, createRoot } from "./SceneFactory.js";
import { createGridGeometry } from "./GeometryFactory.js";
import { createBrush } from "./Brush.js";
import { PhysicsEngine } from "./PhysicsEngine.js";
import { MetaParser } from "../controller/MetaParser.js";


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

        this.metadata = MetaParser.fromNavbar(".ui-sidebar-nav a", this.geom);
        this.activeName = null;

        // react to hover events
        this.metadata.forEach(meta => {
            meta.element.addEventListener("mouseenter", () => this.setActive(meta.name));
            meta.element.addEventListener("mouseleave", () => this.setActive(null));
        });
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

    setActive(name) {
        this.activeName = name;
        this.updateMetadataVisuals();
    }

    updateMetadataVisuals() {
        const { geom, metadata, activeName } = this;
        const colors = geom.colors;
        const pointSizeBase = 2;
        const pointSizeActive = 3.5;

        metadata.forEach(m => {
            const i = m.idx;
            const c = i * 4;
            const isActive = activeName === m.name;
            const isHovered = activeName ? isActive : false;

            const [r, g, b] = this.hexToRgb(m.color);
            colors[c] = r / 255;
            colors[c + 1] = g / 255;
            colors[c + 2] = b / 255;
            colors[c + 3] = 1;
        });

        geom.mesh.material.pointSize = activeName ? pointSizeActive : pointSizeBase;
        geom.mesh.updateVerticesData(BABYLON.VertexBuffer.ColorKind, colors, false);
    }

    hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
    }

    update() { } // updates handled inside physics
    render() { this.scene.render(); }
    dispose() { this.scene.dispose(); }
}

