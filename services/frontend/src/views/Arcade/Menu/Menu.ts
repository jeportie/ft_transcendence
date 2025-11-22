// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Menu.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/21 15:58:38 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 16:08:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import menuHTML from "./menu.html";
import { tasks } from "./tasks/index.js";

export default class ArcadeMenu extends AbstractView {

    constructor(ctx, logger) {
        super(ctx, logger);
        this.setTitle("Arcade");
    }

    async getHTML() {
        return menuHTML;
    }

    async mount() {
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
