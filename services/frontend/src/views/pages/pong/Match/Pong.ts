// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Pong.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 19:15:00 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:24:48 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import pongHTML from "./pong.html";
import { tasks } from "./tasks/index.js";

export default class Game extends AbstractView {

    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
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
