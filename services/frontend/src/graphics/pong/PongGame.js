// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PongGame.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:32:00 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:49:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
import Player from "./Player.js";
import { GameLoop, Keyboard, Line, Rect } from "@jeportie/lib2d";

export default class PongGame {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.kb = new Keyboard();

        // players
        this.leftPlayer = new Player("Left");
        this.rightPlayer = new Player("Right");

        // paddles
        this.leftPaddle = new Paddle(20, canvas.height / 2 - 40, 10, 80, {
            speed: 420, keyboard: this.kb, keyUp: "w", keyDown: "s", canvasHeight: canvas.height, color: "#FECD52"
        });
        this.rightPaddle = new Paddle(canvas.width - 30, canvas.height / 2 - 40, 10, 80, {
            speed: 420, keyboard: this.kb, keyUp: "ArrowUp", keyDown: "ArrowDown", canvasHeight: canvas.height, color: "#57D269"
        });

        // ball
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, 8, { speed: 380, color: "#25AEEE" });
        this.ball.serve(Math.random() < 0.5 ? -1 : 1);

        // loop
        this.loop = new GameLoop((dt) => this.update(dt));
    }

    start() { this.loop.start(); }
    stop() { this.loop.stop(); }

    resetBall(dir = 1) {
        this.ball.pos.x = this.canvas.width / 2;
        this.ball.pos.y = this.canvas.height / 2;
        this.ball.serve(dir);
    }

    update(dt) {
        const canvas = this.canvas;

        // update entities
        this.leftPaddle.update(dt);
        this.rightPaddle.update(dt);
        this.ball.update(dt);

        // world bounces
        this.ball.bounceCanvas(canvas.width, canvas.height);

        // paddle collisions
        this.ball.bouncePaddle(this.leftPaddle, 10);
        this.ball.bouncePaddle(this.rightPaddle, 10);

        // scoring: ball left or right out
        if (this.ball.pos.x + this.ball.r < 0) {
            this.rightPlayer.addPoint();
            this.resetBall(1);
        } else if (this.ball.pos.x - this.ball.r > canvas.width) {
            this.leftPlayer.addPoint();
            this.resetBall(-1);
        }

        // render
        this.render();
    }

    render() {
        const { ctx, canvas } = this;

        // clear
        const bg = new Rect(0, 0, canvas.width, canvas.height);
        bg.render(ctx, { fill: "#0b0f16" });

        // middle dashed line
        const midLine = new Line(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        midLine.render(ctx, { stroke: "#182235", dash: [8, 8] });

        // paddles & ball
        this.leftPaddle.render(ctx);
        this.rightPaddle.render(ctx);
        this.ball.render(ctx);

        // score
        ctx.fillStyle = "#9aa";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${this.leftPlayer.score}`, canvas.width / 2 - 40, 30);
        ctx.fillText(`${this.rightPlayer.score}`, canvas.width / 2 + 40, 30);
    }
}
