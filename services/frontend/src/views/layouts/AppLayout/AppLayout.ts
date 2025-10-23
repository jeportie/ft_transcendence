// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppLayout.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:11:48 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 12:04:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import appLayoutHTML from "./appLayout.html";
import { tasks } from "./tasks/index.ts";


export default class AppLayout extends AbstractLayout {
    #keepCanvas = true;

    async getHTML() {
        return appLayoutHTML;
    }

    async mount() {
        this.#keepCanvas = true;
        await super.mount();

        // Run lifecycle tasks manually
        for (const fn of tasks.init || []) await fn({ layout: this });
        for (const fn of tasks.ready || []) await fn({ layout: this });
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
