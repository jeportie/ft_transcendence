// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupPong.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/17 15:16:32 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 15:33:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { Rect } from "@jeportie/lib2d";
import PongGame from "../../../../graphics/pong/PongGame.js";

export async function setupPong() {
    const canvas = DOM.pongCanvas;
    if (!canvas)
        return;

    const ctx = canvas.getContext("2d");
    const game = new PongGame(canvas, ctx);

    // Toggle FPS
    window.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "f") game.loop.toggleFPS(); });
    const start = DOM.pongStartBtn;
    const stop = DOM.pongStopBtn;

    const bg = new Rect(0, 0, canvas?.width, canvas?.height);
    bg.render(ctx, { fill: "#0b0f16" });

    start?.addEventListener("click", () => {
        game.start();
    })

    stop?.addEventListener("click", () => {
        game.stop();
    })
}
