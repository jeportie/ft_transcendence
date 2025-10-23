// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   OverlayBridge.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:55:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 22:36:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";



export class OverlayBridge {
    constructor(canvas, opts = {}) {
        this.canvas3D = canvas;
        this.canvas2D = document.createElement("canvas");
        this.canvas2D.className = "ui-overlay-canvas";
        Object.assign(this.canvas2D.style, {
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
        });
        document.body.appendChild(this.canvas2D);
        this.ctx = this.canvas2D.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());

        // --- Animation state
        this.lastName = null;
        this.animProgress = 0; // 0..1
        this.speed = opts.speed || 1.5; // higher = faster
    }

    resize() {
        this.canvas2D.width = window.innerWidth;
        this.canvas2D.height = window.innerHeight;
    }

    render(sphere) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        const { geom, metadata, activeName, scene, root, camera } = sphere;
        if (!metadata || !geom || !activeName) {
            this.lastName = null;
            this.animProgress = 0;
            return;
        }

        const meta = metadata.find((m) => m.name === activeName);
        if (!meta) return;

        // --- detect change and reset anim
        if (this.lastName !== activeName) {
            this.lastName = activeName;
            this.animProgress = 0;
        }

        // --- compute positions
        // Prefer droplet center if visible, otherwise the base particle
        const dropWorld = sphere.getDropletWorld(meta.idx);
        const world = dropWorld ??
            BABYLON.Vector3.TransformCoordinates(geom.pos[meta.idx], root.getWorldMatrix());
        const proj = BABYLON.Vector3.Project(
            world,
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(
                scene.getEngine().getRenderWidth(),
                scene.getEngine().getRenderHeight()
            )
        );

        const x1 = proj.x;
        const y1 = proj.y;
        const margin = 600;
        const x2 = proj.x < this.canvas2D.width / 2 ? margin : this.canvas2D.width - margin;
        const y2 = y1;

        // --- Update animation
        const dt = scene.getEngine().getDeltaTime() / 1000;
        this.animProgress += dt * this.speed;
        if (this.animProgress > 1) this.animProgress = 1;
        const t = this.easeOutCubic(this.animProgress);

        // --- Interpolate along the line
        const xMid = x2 + (x1 - x2) * t;
        const yMid = y2 + (y1 - y2) * t;

        // --- Draw partial line
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(xMid, yMid);
        ctx.stroke();

        // --- Draw label
        ctx.font = "600 1rem 'Orbitron', sans-serif";
        // ctx.font = "18px monospace";
        ctx.fillStyle = meta.color;
        const offset =
            proj.x < this.canvas2D.width / 2
                ? -ctx.measureText(meta.name).width - 10
                : 10;
        ctx.fillText(meta.name, x2 + offset, y2 + 4);
    }

    // Smooth easing function for nicer motion
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    dispose() {
        this.canvas2D.remove();
    }
}

