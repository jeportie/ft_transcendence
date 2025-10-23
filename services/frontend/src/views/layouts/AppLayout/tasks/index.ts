// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 09:13:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { setupMenuSphere, teardownMenuSphere } from "./setupMenuSphere.js";
import { setupSidebar, teardownSidebar } from "./setupSidebar.js";
import { setupLogout, teardownLogout } from "./setupLogout.js";

export const tasks = {
    init: [setupMenuSphere],
    ready: [setupSidebar, setupLogout],
    teardown: [
        (ctx?: any) => {
            teardownSidebar();
            teardownLogout();
            teardownMenuSphere(ctx);
        },
    ],

    /** Allow layout context propagation */
    withContext(ctx: any) {
        return {
            ...this,
            teardown: this.teardown.map((fn) => () => fn(ctx)),
        };
    },
};
