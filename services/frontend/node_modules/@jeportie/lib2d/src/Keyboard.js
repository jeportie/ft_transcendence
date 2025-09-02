// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Keyboard.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/20 15:14:47 by jeportie          #+#    #+#             //
//   Updated: 2025/08/20 15:18:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Minimal keyboard helper.
 */
export default class Keyboard {
    constructor(target = window) {
        this.down = new Set();
        target.addEventListener("keydown", (e) => this.down.add(e.key));
        target.addEventListener("keyup", (e) => this.down.delete(e.key));
    }
    /**
     * Is a key currently held?
     * @param {string} key
     * @returns {boolean}
     */
    isDown(key) { return this.down.has(key); }
}
