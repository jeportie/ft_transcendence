// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LandingLayout.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 18:34:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import { runParticle } from "../games/particles/particleAnimation";

export default class LandingLayout extends AbstractLayout {
    #cleanup?: () => void;

    async getHTML() {
        return /*html*/ `
      <section class="relative min-h-screen overflow-hidden bg-black">
        <!-- Background -->
        <canvas id="hero-canvas" class="absolute inset-0 w-full h-full block z-0"></canvas>

        <!-- Top nav -->
        <header class="absolute top-0 inset-x-0 z-20">
          <nav class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <a href="/" data-link class="text-slate-100 font-semibold tracking-wide">ft_transcendence</a>
            <div class="flex items-center gap-3">
              <a href="/login"      data-link class="px-3 py-1.5 rounded-lg text-slate-100/90 hover:text-white hover:bg-white/10 transition">Login</a>
              <a href="/subscribe"  data-link class="px-3 py-1.5 rounded-lg text-slate-100/90 hover:text-white hover:bg-white/10 transition">Subscribe</a>
              <a href="/about"      data-link class="px-3 py-1.5 rounded-lg text-slate-100/90 hover:text-white hover:bg-white/10 transition">About</a>
            </div>
          </nav>
        </header>

        <!-- Centered modal area -->
        <div id="modal-layer"
             class="absolute inset-0 z-10 grid place-items-center pointer-events-none p-6">
          <div data-router-outlet
               class="w-full max-w-md pointer-events-auto">
               <!-- router-slot -->
          </div>
        </div>

        <!-- (Optional) Footer hint -->
        <div class="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
          <p class="text-slate-200/70 text-sm">
            Move your mouse — particles follow. (Babylon later)
          </p>
        </div>
      </section>
    `;
    }

    mount() {
        this.#cleanup = runParticle("#hero-canvas");
    }

    destroy() {
        this.#cleanup?.();
    }
}
