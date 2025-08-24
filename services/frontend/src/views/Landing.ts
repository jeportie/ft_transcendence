// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Landing.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:43:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class Landing extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Welcome");
    }

    async getHTML() {
        return /*html*/ `
      <section class="min-h-screen flex flex-col md:flex-row items-stretch">
        <div class="w-full md:w-[420px] p-8 flex flex-col justify-center gap-6 bg-slate-900">
          <h1 class="text-3xl font-bold">ft_transcendence</h1>
          <p class="text-slate-300">Log in to enter your dashboard.</p>
          <form id="landing-login" class="space-y-4">
            <input type="email" name="email" placeholder="Email"
              class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-800 focus:outline-none" />
            <input type="password" name="password" placeholder="Password"
              class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-800 focus:outline-none" />
            <button id="login-btn" class="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              Enter dashboard
            </button>
          </form>
          <div class="text-xs text-slate-400">
            (Demo: button just navigates to <code>/dashboard</code>)
          </div>
          <nav class="pt-4 text-sm">
            <a href="/posts" data-link class="underline text-slate-300 hover:text-white">Browse posts</a>
          </nav>
        </div>

        <div class="flex-1 relative bg-black">
          <canvas id="hero-canvas" class="absolute inset-0 w-full h-full block"></canvas>

          <div class="absolute bottom-6 left-6 right-6 pointer-events-none">
            <p class="text-slate-200/80">
              Move your mouse — particles follow. (Swap to Babylon here later.)
            </p>
          </div>
        </div>
      </section>
    `;
    }

    mount() {
        // Login → just navigate for now
        const btn = document.getElementById("login-btn");
        btn?.addEventListener("click", (e) => {
            e.preventDefault();
            // @ts-ignore
            window.navigateTo("/dashboard");
        });

        // Canvas particles following mouse
        const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        let w = 0, h = 0, raf = 0;
        const particles: { x: number; y: number; vx: number; vy: number }[] = [];
        const N = 140;
        const mouse = { x: 0, y: 0, has: false };

        function resize() {
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

        function step() {
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

            raf = requestAnimationFrame(step);
        }

        function onMouse(e: MouseEvent) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.has = true;
        }
        function onLeave() { mouse.has = false; }

        // lifecycle
        const onResize = () => { resize(); init(); };
        window.addEventListener("resize", onResize);
        canvas.addEventListener("mousemove", onMouse);
        canvas.addEventListener("mouseleave", onLeave);

        resize();
        init();
        step();

        // clean up if view gets destroyed later
        this.destroy = () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            canvas.removeEventListener("mousemove", onMouse);
            canvas.removeEventListener("mouseleave", onLeave);
        };
    }
}
