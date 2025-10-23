// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   OverlayBridge.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:55:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:38:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export class OverlayBridge {
    constructor(canvas) {
        this.canvas3D = canvas;
        this.canvas2D = document.createElement("canvas");
        this.canvas2D.className = "ui-overlay-canvas";
        Object.assign(this.canvas2D.style, {
            position: "absolute",
            top: 0, left: 0,
            pointerEvents: "none",
        });
        document.body.appendChild(this.canvas2D);
        this.ctx = this.canvas2D.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas2D.width = window.innerWidth;
        this.canvas2D.height = window.innerHeight;
    }

    render(sphere) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        const geom = sphere.geom;
        if (!geom || !geom.pos.length) return;

        const i = Math.floor(geom.COUNT / 2);
        const p = geom.pos[i];
        const scene = sphere.scene;
        const engine = scene.getEngine();
        const camera = sphere.camera;
        const world = BABYLON.Vector3.TransformCoordinates(p, sphere.root.getWorldMatrix());
        const proj = BABYLON.Vector3.Project(
            world,
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
        );

        const margin = 280; // fixed vertical border area
        const x1 = proj.x;
        const y1 = proj.y;
        const x2 = proj.x < this.canvas2D.width / 2 ? margin : this.canvas2D.width - margin;
        const y2 = y1;

        ctx.strokeStyle = "rgba(0,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "13px monospace";
        const label = "Particle";
        const offsetX = proj.x < this.canvas2D.width / 2
            ? -ctx.measureText(label).width - 10
            : 10;
        ctx.fillText(label, x2 + offsetX, y2 + 4);
    }

    dispose() {
        this.canvas2D.remove();
    }
}


