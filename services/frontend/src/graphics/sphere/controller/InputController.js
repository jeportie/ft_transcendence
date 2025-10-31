// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   InputController.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:56:20 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:02:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class InputController {
    constructor(canvas, bus) {
        this.bus = bus;
        window.addEventListener("keydown", (e) => bus.emit("key:press", e.key));
        canvas.addEventListener("mousemove", (e) => bus.emit("mouse:move", e));
    }
}

