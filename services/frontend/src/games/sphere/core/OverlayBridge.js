// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   OverlayBridge.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:55:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 16:03:54 by jeportie         ###   ########.fr       //
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
        const { geom, metadata, activeName, scene, root, camera } = sphere;
        if (!metadata || !geom || !activeName) return;

        const meta = metadata.find(m => m.name === activeName);
        if (!meta) return;

        const p = geom.pos[meta.idx];
        const world = BABYLON.Vector3.TransformCoordinates(p, root.getWorldMatrix());
        const proj = BABYLON.Vector3.Project(
            world,
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(scene.getEngine().getRenderWidth(), scene.getEngine().getRenderHeight())
        );

        const x1 = proj.x;
        const y1 = proj.y;
        const margin = 250;
        const x2 = proj.x < this.canvas2D.width / 2 ? margin : this.canvas2D.width - margin;
        const y2 = y1;

        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.font = "13px monospace";
        ctx.fillStyle = meta.color;
        const offset = proj.x < this.canvas2D.width / 2 ? -ctx.measureText(meta.name).width - 10 : 10;
        ctx.fillText(meta.name, x2 + offset, y2 + 4);
    }

    dispose() {
        this.canvas2D.remove();
    }
}


