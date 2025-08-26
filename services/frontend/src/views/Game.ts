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
import { Rect } from "@jeportie/lib2d";
import PongGame from "../games/pong/PongGame.js";

export default class Game extends AbstractView {

    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Game");
    }

    async getHTML() {
        return /*html*/ `
        <h1 class="ui-title">Pong</h1>
    
        <div class="ui-card">
          <div class="ui-card-inner">
            <canvas id="gameCanvas" width="800" height="600" class="ui-canvas"></canvas>
            <div class="flex gap-2">
              <button id="start-button" class="ui-btn-primary">Start</button>
              <button id="stop-button"  class="ui-btn-secondary">Stop</button>
            </div>
            <p class="ui-text-small">Controls Left Player: w ↑ / s ↓</p>
            <p class="ui-text-small">Controls Right Player: Arrow ↑ / Arrow ↓</p>
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
