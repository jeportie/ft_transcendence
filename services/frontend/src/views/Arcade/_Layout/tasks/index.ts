// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 13:59:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { setupParticles, teardownParticles } from "./setupParticles.js";

export const tasks = {
    init: [setupParticles],
    ready: [],
    teardown: [
        (ctx?: any) => {
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

