// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   OverlayAnimationHook.js                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/25 23:19:02 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 23:42:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractAnimationHook } from "@jeportie/mini-spa";

export default class OverlayAnimationHook extends AbstractAnimationHook {
    async mount({ helpers }) {
        // If we're staying inside the same layout (e.g. "/" <-> "/login"),
        // do a leaf-only swap into the outlet so the canvas keeps running.
        if (helpers.sameLayout?.()) {
            helpers.teardownLeaf?.();
            const outlet = document.querySelector("[data-router-outlet]");
            if (outlet) {
                await helpers.commit({ targetEl: outlet, leafOnly: true });
                return;
            }
            // no outlet? fall through to full swap
        }
        // Different layout (e.g. "/login" -> "/dashboard"): full teardown + commit.
        helpers.teardown();
        await helpers.commit();
    }
}

