// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Landing.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 14:26:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import { runParticle } from "../games/particles/particleAnimation";

export default class Landing extends AbstractView {
    #cleanup?: () => void;

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
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        runParticle(canvas, ctx);
        this.destroy = () => this.#cleanup?.();
    }
}
