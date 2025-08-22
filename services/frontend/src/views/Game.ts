// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Game.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 19:15:00 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:15:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import PongGame from "../games/pong/PongGame.js";
import Rect from "../games/lib2D/Rect.js";

export default class Game extends AbstractView {

    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Game");
    }

    async getHTML() {
        return /*html*/ `
          <h1 class="text-2xl font-bold">Pong</h1>

          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <div class="space-y-3">
              <canvas id="gameCanvas" width="800" height="600" class="w-full rounded-xl border border-slate-700 bg-black"></canvas>
              <div class="flex gap-2">
                <button id="start-button" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Start</button>
                <button id="stop-button"  class="px-4 py-2 rounded bg-slate-700 hover:bg-slate-700/60">Stop</button>
              </div>
              <p class="text-slate-300 text-sm">Controls Left Player: w ↑ / s ↓</p>
              <p class="text-slate-300 text-sm">Controls Right Player: Arrow ↑ / Arrow ↓</p>
            </div>
          </div>
    `;
    }

    mount() {
        const canvas = document.querySelector("#gameCanvas");
        const ctx = canvas.getContext("2d");

        const game = new PongGame(canvas, ctx);

        // Toggle FPS
        window.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "f") game.loop.toggleFPS(); });

        const start = document.querySelector("#start-button");
        const stop = document.querySelector("#stop-button");

        const bg = new Rect(0, 0, canvas.width, canvas.height);
        bg.render(ctx, { fill: "#0b0f16" });

        start.addEventListener("click", () => {
            game.start();
        })

        stop.addEventListener("click", () => {
            game.stop();
        })
    }
}
