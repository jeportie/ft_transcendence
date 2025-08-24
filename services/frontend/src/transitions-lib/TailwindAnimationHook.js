// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   TailwindAnimationHook.js                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/24 11:51:09 by jeportie          #+#    #+#             //
//   Updated: 2025/08/24 11:52:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractAnimationHook } from "@jeportie/mini-spa";
import { getMaxTransitionMs } from "./time/getMaxTransitionMs.js";

/**
 * Options:
 *   variant: "fade" | "slide-push"
 *   // fade runs in "container" mode on #app (mountEl)
 *   // slide-push runs in "overlap" mode on two .view-slot wrappers
 */
export default class TailwindAnimationHook extends AbstractAnimationHook {
    /**
     * @param {{ variant?: "fade" | "slide-push" }} opts
     */
    constructor({ variant = "fade" } = {}) {
        super();
        this.variant = variant;
    }

    async mount({ mountEl, ctx, helpers }) {
        if (this.variant === "slide-push") {
            await this.#overlapSlidePush({ mountEl, helpers });
        } else {
            await this.#containerFade({ mountEl, helpers });
        }
    }

    /* ----------------------- container / fade ----------------------- */
    async #containerFade({ mountEl, helpers }) {
        // Animate OUT existing content on the container
        if (mountEl.childElementCount > 0) {
            mountEl.setAttribute("data-trans", "fade");
            await this.#runPhase(mountEl, "out");
            if (helpers.isStale()) return;
        }

        // Swap content
        helpers.teardown();          // destroy instances, keep DOM intact until commit
        await helpers.commit();      // inject into mountEl
        if (helpers.isStale()) return;

        // Animate IN new content
        mountEl.setAttribute("data-trans", "fade");
        await this.#runPhase(mountEl, "in");
    }

    /* ------------------------- overlap / slide-push ------------------------- */
    async #overlapSlidePush({ mountEl, helpers }) {
        // Ensure mount can hold absolutely-positioned slots
        const cs = getComputedStyle(mountEl);
        if (cs.position === "static") mountEl.style.position = "relative";
        if (cs.overflow !== "hidden") mountEl.style.overflow = "hidden";

        let oldSlot = mountEl.querySelector(".view-slot");
        if (!oldSlot && mountEl.childElementCount > 0) {
            // Wrap existing content into a slot so we can animate it out
            const wrap = document.createElement("div");
            wrap.className = "view-slot route-leave";
            wrap.style.position = "absolute";
            wrap.style.inset = "0";
            wrap.innerHTML = mountEl.innerHTML;
            mountEl.innerHTML = "";
            mountEl.appendChild(wrap);
            oldSlot = wrap;
        }

        // Prepare the new slot where the next view will be committed
        const newSlot = document.createElement("div");
        newSlot.className = "view-slot route-enter";
        newSlot.style.position = "absolute";
        newSlot.style.inset = "0";
        mountEl.appendChild(newSlot);

        // Destroy instances (DOM stays) and commit next view into NEW slot
        helpers.teardown();
        await helpers.commit(newSlot);
        if (helpers.isStale()) { newSlot.remove(); return; }

        // Tag both slots for CSS
        newSlot.setAttribute("data-trans", "slide-push");
        if (oldSlot) oldSlot.setAttribute("data-trans", "slide-push");

        // Animate both in parallel (new in from right, old out to right)
        await Promise.all([
            this.#runPhase(newSlot, "in"),
            oldSlot ? this.#runPhase(oldSlot, "out") : Promise.resolve(),
        ]);
        if (helpers.isStale()) { newSlot.remove(); return; }

        // Cleanup
        oldSlot?.remove();
    }

    /* --------------------------- tiny runner --------------------------- */
    async #runPhase(el, phase) {
        return new Promise((resolve) => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                el.removeEventListener("transitionend", onEnd);
                el.classList.remove(
                    "route-enter", "route-enter-active",
                    "route-leave", "route-leave-active"
                );
                resolve();
            };
            const onEnd = (e) => { if (e.target === el) finish(); };

            if (phase === "out") {
                el.classList.remove("route-enter", "route-enter-active");
                el.classList.add("route-leave");
            } else {
                el.classList.remove("route-leave", "route-leave-active");
                el.classList.add("route-enter");
            }

            requestAnimationFrame(() => {
                void el.offsetWidth; // reflow
                el.classList.add(phase === "out" ? "route-leave-active" : "route-enter-active");
                el.addEventListener("transitionend", onEnd, { once: true });
                // safety timeout
                const total = getMaxTransitionMs(el);
                setTimeout(finish, (total || 0) + 50);
            });
        });
    }
}
