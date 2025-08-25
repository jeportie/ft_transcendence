// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   particleAnimation.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/25 13:32:08 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 14:20:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let w = 0, h = 0, raf = 0;
const particles = [];
const N = 140;
const mouse = { x: 0, y: 0, has: false };

function resize(canvas, ctx) {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function init() {
    particles.length = 0;
    for (let i = 0; i < N; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
        });
    }
}

function step(ctx) {
    ctx.clearRect(0, 0, w, h);
    // subtle gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f16");
    g.addColorStop(1, "#05070b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // physics
    for (const p of particles) {
        // mild attraction to mouse
        if (mouse.has) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d2 = Math.max(60, dx * dx + dy * dy);
            const f = 200 / d2;       // falloff
            p.vx += f * dx * 0.02;
            p.vy += f * dy * 0.02;
        }

        // velocity damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // integrate
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
    }
    // draw links
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130) {
                const alpha = Math.max(0, 1 - d2 / (130 * 130));
                ctx.strokeStyle = `rgba(148,163,184,${alpha * 0.4})`; // slate-400
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }
    // draw particles
    ctx.fillStyle = "#93c5fd"; // sky-300
    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    raf = requestAnimationFrame(() => step(ctx));
}

export function runParticle(canvas, ctx) {
    // lifecycle
    const onResize = () => { resize(canvas, ctx); init(); };
    const onMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.has = true;
    };
    const onLeave = () => { mouse.has = false };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    resize(canvas, ctx);
    init();
    step(ctx);

    // clean up if view gets destroyed later
    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        canvas.removeEventListener("mouseleave", onLeave);
    };
}
