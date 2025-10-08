// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   particleAnimation-old.js                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/25 13:32:08 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 21:47:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Circle, Point, Vector, GameLoop } from "@jeportie/lib2d";

const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const N = 140;

let w = 0, h = 0;
let ctx;
let loop;
const particles = [];
const mouse = { pos: new Point(0, 0), has: false };

class Particle extends Circle {
    constructor(x, y) {
        super(x, y, 2);
        this.vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
    }

    update(dt) {
        // mild attraction to mouse
        if (mouse.has) {
            const dir = mouse.pos.sub(this.pos);
            const d2 = Math.max(60, dir.x * dir.x + dir.y * dir.y);
            const f = 200 / d2;
            this.vel.x += f * dir.x * 0.02;
            this.vel.y += f * dir.y * 0.02;
        }

        // velocity damping
        this.vel.scaleSelf(0.98);

        // integrate
        this.pos.move(this.vel, 1);

        // wrap
        if (this.pos.x < -10) this.pos.x = w + 10;
        if (this.pos.x > w + 10) this.pos.x = -10;
        if (this.pos.y < -10) this.pos.y = h + 10;
        if (this.pos.y > h + 10) this.pos.y = -10;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = "#93c5fd"; // sky-300
        ctx.fill();
    }
}

function resize(canvas) {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function init(canvas) {
    particles.length = 0;
    for (let i = 0; i < N; i++) {
        particles.push(new Particle(Math.random() * w, Math.random() * h));
    }
}

function drawBackground(ctx) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f16");
    g.addColorStop(1, "#05070b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
}

function drawLinks(ctx) {
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.pos.x - b.pos.x;
            const dy = a.pos.y - b.pos.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130) {
                const alpha = Math.max(0, 1 - d2 / (130 * 130));
                ctx.strokeStyle = `rgba(148,163,184,${alpha * 0.4})`; // slate-400
                ctx.beginPath();
                ctx.moveTo(a.pos.x, a.pos.y);
                ctx.lineTo(b.pos.x, b.pos.y);
                ctx.stroke();
            }
        }
    }
}

export function runParticle(id) {
    const canvas = document.querySelector(id);
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onResize = () => { resize(canvas); init(canvas); };
    const onMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.pos.x = e.clientX - rect.left;
        mouse.pos.y = e.clientY - rect.top;
        mouse.has = true;
    };
    const onLeave = () => { mouse.has = false; };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    resize(canvas);
    init(canvas);

    loop = new GameLoop((dt) => {
        drawBackground(ctx);
        for (const p of particles) p.update(dt);
        drawLinks(ctx);
        for (const p of particles) p.render(ctx);
    });
    loop.start();

    // Cleanup
    return () => {
        loop.stop();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onLeave);
    };
}
