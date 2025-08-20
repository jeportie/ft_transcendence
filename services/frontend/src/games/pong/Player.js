// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Player.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/21 15:00:00 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:29:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Represents a Pong player with a name and score.
 */
export default class Player {
    /**
     * Creates a new Player.
     * @param {string} [name="Player"] - The name of the player.
     */
    constructor(name = "Player") {
        /** @type {string} The player's display name. */
        this.name = name;

        /** @type {number} The player's current score. */
        this.score = 0;
    }

    /**
     * Adds points to the player's score.
     * @param {number} [n=1] - The number of points to add.
     * @returns {void}
     */
    addPoint(n = 1) {
        this.score += n;
    }

    /**
     * Resets the player's score to zero.
     * @returns {void}
     */
    reset() {
        this.score = 0;
    }
}

