// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Pong.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 19:15:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 15:25:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-js";
import pongHTML from "./pong.html";
import { tasks } from "./tasks/index.js";

export default class Game extends AbstractView {

    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Game");
    }

    async getHTML() {
        return (pongHTML);
    }

    async mount() {
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
