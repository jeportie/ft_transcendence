// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   OverlayBridge.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:55:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 19:28:24 by jeportie         ###   ########.fr       //
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
        canvas.parentElement?.appendChild(this.canvas2D);
        this.canvas2D.style.zIndex = "10";
        this.ctx = this.canvas2D.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());

        // 🧠 Store per-meta animations: { progress, target }
        this.animations = new Map();
        this.speed = opts.speed || 6.0;
    }

    resize() {
        this.canvas2D.width = window.innerWidth;
        this.canvas2D.height = window.innerHeight;
    }

    render(sphere) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);

        const { geom, metadata, activeName, scene, root, camera } = sphere;
        if (!metadata || !geom || !scene) return;

        const dt = scene.getEngine().getDeltaTime() / 1000;
        const fadeSpeed = this.speed * dt;

        // 🔄 Update all animation states
        for (const meta of metadata) {
            const name = meta.name;
            const isActive = activeName === name;
            const anim = this.animations.get(name) || { progress: 0, target: 0 };

            anim.target = isActive ? 1 : 0;


            anim.progress += (anim.target - anim.progress) * fadeSpeed;
            if (anim.progress < 0.01 && anim.target === 0) {
                this.animations.delete(name);
                continue;
            }
            this.animations.set(name, anim);
        }

        // 🎨 Draw all visible overlays concurrently
        for (const [name, anim] of this.animations) {
            const meta = metadata.find((m) => m.name === name);
            if (!meta || anim.progress <= 0) continue;

            const dropWorld = sphere.getDropletWorld(meta.idx);
            const world =
                dropWorld ??
                BABYLON.Vector3.TransformCoordinates(
                    geom.pos[meta.idx],
                    root.getWorldMatrix()
                );
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
            const x2 =
                proj.x < this.canvas2D.width / 2
                    ? margin
                    : this.canvas2D.width - margin;
            const y2 = y1;

            const t = this.easeInOutCubic(anim.progress);
            const xMid = x2 + (x1 - x2) * t;
            const yMid = y2 + (y1 - y2) * t;

            ctx.strokeStyle = meta.color;
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = 0.7 + 0.3 * anim.progress;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(xMid, yMid);
            ctx.stroke();

            ctx.font = "600 1rem 'Orbitron', sans-serif";
            ctx.fillStyle = meta.color;
            ctx.globalAlpha = anim.progress;
            const offset =
                proj.x < this.canvas2D.width / 2
                    ? -ctx.measureText(meta.name).width - 10
                    : 10;
            ctx.fillText(meta.name, x2 + offset, y2 + 4);
            ctx.globalAlpha = 1.0;
        }
    }

    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    dispose() {
        this.canvas2D.remove();
    }
}
