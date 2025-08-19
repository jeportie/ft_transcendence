// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Game.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 19:15:00 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 19:22:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.ts";
import createPong from "../games/pong/init.ts";

export default class Game extends AbstractView {

    private disposeGame?: () => void;

    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Game");
    }

    async getHTML() {
        return /*html*/ `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
            <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
          </nav>
        </aside>

        <main class="space-y-4">
          <h1 class="text-2xl font-bold">Pong</h1>

          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <div class="space-y-3">
              <canvas id="gameCanvas" width="800" height="600" class="w-full rounded-xl border border-slate-700 bg-black"></canvas>
              <div class="flex gap-2">
                <button id="btn-start" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Start</button>
                <button id="btn-stop"  class="px-4 py-2 rounded bg-slate-700 hover:bg-slate-700/60">Stop</button>
              </div>
              <p class="text-slate-300 text-sm">Controls: ↑ / ↓</p>
            </div>
          </div>
        </main>
      </div>
    `;
    }

    mount() {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
        if (!canvas) return;

        // createPong returns { start, stop, dispose }
        const api = createPong(canvas);

        const startBtn = document.getElementById("btn-start");
        const stopBtn = document.getElementById("btn-stop");

        startBtn?.addEventListener("click", api.start);
        stopBtn?.addEventListener("click", api.stop);

        // auto-start once mounted
        api.start();

        // remember how to cleanup (stop loop + remove listeners)
        this.disposeGame = () => {
            stopBtn?.removeEventListener("click", api.stop);
            startBtn?.removeEventListener("click", api.start);
            api.dispose();
        };
    }

    destroy() {
        this.disposeGame?.();
    }
}
