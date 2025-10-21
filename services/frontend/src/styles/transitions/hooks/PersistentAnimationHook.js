// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   persistentAnimationHook.js                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 13:18:01 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 13:18:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractAnimationHook } from "@jeportie/mini-spa";

/**
 * Keeps the layout (e.g., Babylon canvas) alive between child route transitions.
 * Only replaces the [data-router-outlet] content when staying inside same layout.
 */
export default class PersistentAnimationHook extends AbstractAnimationHook {
    async mount({ helpers }) {
        if (helpers.sameLayout?.()) {
            // ✅ Same layout: only update the leaf outlet
            helpers.teardownLeaf?.();
            const outlet = document.querySelector("[data-router-outlet]");
            if (outlet) {
                await helpers.commit({ targetEl: outlet, leafOnly: true });
                return;
            }
        }
        // ❌ Different layout: full teardown
        helpers.teardown();
        await helpers.commit();
    }
}
