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
import { logger } from "@system/core/logger.js"

const log = logger.withPrefix("[PersistentHook] ");

/**
 * Keeps the current layout (Babylon canvas, navbar, etc.) alive
 * between child route transitions.
 */
export default class PersistentAnimationHook extends AbstractAnimationHook {
    async mount({ mountEl, helpers }) {
        log.info("mount → sameLayout?", helpers.sameLayout());

        // If layout is reused
        if (helpers.sameLayout()) {
            await helpers.teardownLeaf();

            // Wait up to ~500 ms for the outlet to appear in DOM
            const outlet = await waitForOutlet(mountEl);
            if (!outlet) {
                log.warn("⚠️ Outlet never appeared — full commit fallback");
                helpers.teardown();
                await helpers.commit();
                return;
            }

            log.info("Same layout detected → leaf-only swap");
            await helpers.commit({ targetEl: outlet, leafOnly: true });
            log.info("✅ Layout preserved");
            return;
        }

        // Different layout
        log.info("⚠️ Different layout → full teardown");
        helpers.teardown();
        await helpers.commit();
        log.info("✅ Full commit done");
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

