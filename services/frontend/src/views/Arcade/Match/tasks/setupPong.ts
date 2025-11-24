// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupPong.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 14:21:09 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 14:21:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Rect } from "@jeportie/lib2d";
import PongGame from "@graphics/pong/PongGame.js";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[PongSetup]");

export function setupPong(
    canvas: HTMLCanvasElement,
    startBtn: HTMLButtonElement | null,
    stopBtn: HTMLButtonElement | null
) {
    if (!canvas) {
        log.error("setupPong called without canvas");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        log.error("Failed to get 2D context from canvas");
        return;
    }

    const game = new PongGame(canvas, ctx);

    // Toggle FPS overlay with "f"
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "f")
            game.loop.toggleFPS();
    });

    // Draw static background once
    const bg = new Rect(0, 0, canvas.width, canvas.height);
    bg.render(ctx, { fill: "#0b0f16" });

    startBtn?.addEventListener("click", () => {
        log.info("Start button clicked");
        game.start();
    });

    stopBtn?.addEventListener("click", () => {
        log.info("Stop button clicked");
        game.stop();
    });
}

