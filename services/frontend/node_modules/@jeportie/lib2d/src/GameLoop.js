// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   GameLoop.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/21 11:45:00 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 14:00:04 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * A minimal game loop utility that wraps requestAnimationFrame and provides
 * delta-time (dt) updates. Includes an optional FPS overlay for debugging.
 */
export default class GameLoop {
    /**
     * Creates a new GameLoop.
     * @param {function(number, GameLoop):void} update - The function called each frame.
     *        It receives the delta time (in seconds) and the loop instance.
     */
    constructor(update) {
        this.update = update;
        this.last = 0;
        this.running = false;

        /** @type {boolean} Whether to show the FPS overlay. */
        this.showFPS = false;

        /** @type {number} The last calculated frames-per-second value. */
        this.fps = 0;
    }

    /**
     * Starts the game loop. Does nothing if already running.
     * @returns {void}
     */
    start() {
        if (this.running) return;
        this.running = true;
        this.last = performance.now();
        const step = (t) => {
            if (!this.running) return;
            const dt = (t - this.last) / 1000; // seconds
            this.last = t;

            // calculate fps
            this.fps = Math.round(1 / dt);

            this.update(dt, this);
            this._renderOverlay();

            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /**
     * Stops the game loop.
     * @returns {void}
     */
    stop() { this.running = false; }

    /**
     * Toggles the debug FPS overlay on or off.
     * @returns {void}
     */
    toggleFPS() {
        this.showFPS = !this.showFPS;
    }

    /**
     * Internal helper: renders the FPS overlay in the top-left corner if enabled.
     * @private
     * @returns {void}
     */
    _renderOverlay() {
        if (!this.showFPS) return;
        const ctx = document.querySelector("canvas").getContext("2d");
        ctx.fillStyle = "lime";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`FPS: ${this.fps}`, 5, 5);
    }
}

