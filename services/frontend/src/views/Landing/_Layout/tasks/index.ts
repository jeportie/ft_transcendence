// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 16:25:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { setupParticles, teardownParticles } from "./setupParticles.js";
import { setupAuthToggle, teardownAuthToggle } from "./setupAuthToggle.js";

export const tasks = {
    init: [setupParticles],
    ready: [setupAuthToggle],
    teardown: [
        (ctx?: any) => {
            teardownAuthToggle();
            teardownParticles(ctx);
        },
    ],

    withContext(ctx: any) {
        return {
            ...this,
            teardown: this.teardown.map((fn) => () => fn(ctx)),
        };
    },
};

