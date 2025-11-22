// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ArcadeLayout.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 13:59:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import arcadeLayoutHTML from "./ArcadeLayout.html";
import { tasks } from "./tasks/index.js";

export default class ArcadeLayout extends AbstractLayout {
    #keepCanvas = true;

    constructor(ctx: any, logger: any) {
        super(ctx, logger);
    }

    async getHTML() {
        return arcadeLayoutHTML;
    }

    async mount() {
        this.#keepCanvas = true;
        await super.mount();

        // Run lifecycle tasks manually
        for (const fn of tasks.init || []) await (fn as any)({ layout: this });
        for (const fn of tasks.ready || []) await (fn as any)({ layout: this });
    }

    /** Allow child views to request full teardown next exit */
    reloadOnExit() {
        this.#keepCanvas = false;
    }

    async destroy() {
        const ctx = { keepCanvas: this.#keepCanvas, layout: this };
        if (tasks.teardown) {
            for (const fn of tasks.teardown) await fn(ctx);
        }
        await super.destroy();
    }
}
