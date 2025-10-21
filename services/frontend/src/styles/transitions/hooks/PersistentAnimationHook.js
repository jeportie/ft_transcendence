// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   persistentAnimationHook.js                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/21 13:18:01 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 15:58:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractAnimationHook } from "@jeportie/mini-spa";

/**
 * Keeps the current layout (Babylon canvas, navbar, etc.) alive
 * between child route transitions.
 */
export default class PersistentAnimationHook extends AbstractAnimationHook {
    async mount({ mountEl, helpers }) {
        console.log("[PersistentHook] mount → sameLayout?", helpers.sameLayout());

        // If layout is reused
        if (helpers.sameLayout()) {
            await helpers.teardownLeaf();

            // Wait up to ~500 ms for the outlet to appear in DOM
            const outlet = await waitForOutlet(mountEl);
            if (!outlet) {
                console.warn("[PersistentHook] ⚠️ Outlet never appeared — full commit fallback");
                helpers.teardown();
                await helpers.commit();
                return;
            }

            console.log("[PersistentHook] Same layout detected → leaf-only swap");
            await helpers.commit({ targetEl: outlet, leafOnly: true });
            console.log("[PersistentHook] ✅ Layout preserved");
            return;
        }

        // Different layout
        console.log("[PersistentHook] ⚠️ Different layout → full teardown");
        helpers.teardown();
        await helpers.commit();
        console.log("[PersistentHook] ✅ Full commit done");
    }
}

/** Utility: waits for outlet to exist in DOM */
function waitForOutlet(root, selector = "[data-router-outlet]", timeout = 500) {
    return new Promise((resolve) => {
        const found = root.querySelector(selector);
        if (found) return resolve(found);

        const obs = new MutationObserver(() => {
            const el = root.querySelector(selector);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        obs.observe(root, { childList: true, subtree: true });

        setTimeout(() => {
            obs.disconnect();
            resolve(null);
        }, timeout);
    });
}

