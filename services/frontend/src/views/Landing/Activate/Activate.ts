// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Activate.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 13:39:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 09:46:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import activateHTML from "./activate.html";
import { tasks } from "./tasks/index.js";

export default class Activate extends AbstractView {
    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
        this.setTitle("Activate Account");
    }

    async getHTML() {
        return (activateHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
