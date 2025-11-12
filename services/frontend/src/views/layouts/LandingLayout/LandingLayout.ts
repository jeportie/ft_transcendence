// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LandingLayout.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 16:25:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import landingLayoutHTML from "./landingLayout.html";
import { tasks } from "./tasks/index.js";

export default class LandingLayout extends AbstractLayout {
    #keepCanvas = true;

    constructor(ctx: any, logger: any) {
        super(ctx, logger);
    }

    async getHTML() {
        return landingLayoutHTML;
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
