// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   TailwindAnimationHook.js                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/24 14:24:35 by jeportie          #+#    #+#             //
//   Updated: 2025/08/24 14:25:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractAnimationHook, getMaxTransitionMs } from "@jeportie/mini-spa";

export default class TailwindAnimationHook extends AbstractAnimationHook {
    constructor({ variant = "fade" } = {}) {
        super();
        this.variant = variant;
    }

    async mount({ mountEl, helpers }) {
        switch (this.variant) {
            case "fade":
                await this.#containerFade({ mountEl, helpers });
                break;
            case "slide":
                await this.#containerSlide({ mountEl, helpers });
                break;
            case "zoom":
                await this.#containerZoom({ mountEl, helpers });
                break;
            case "slide-push":
                await this.#overlapPushLeft({ mountEl, helpers });
                break;
            case "track":
                await this.#trackPush({ mountEl, helpers });
                break;
            default:
                await this.#containerFade({ mountEl, helpers });
        }
    }

    /* -------- container fade -------- */
    async #containerFade({ mountEl, helpers }) {
        if (mountEl.childElementCount > 0) {
            mountEl.setAttribute("data-trans", "fade");
            await this.#runPhase(mountEl, "out");
            if (helpers.isStale()) return;
        }
        helpers.teardown();
        await helpers.commit();
        if (helpers.isStale()) return;

        mountEl.setAttribute("data-trans", "fade");
        await this.#runPhase(mountEl, "in");
    }

    /* -------- container slide -------- */
    async #containerSlide({ mountEl, helpers }) {
        if (mountEl.childElementCount > 0) {
            mountEl.setAttribute("data-trans", "slide");
            await this.#runPhase(mountEl, "out");
            if (helpers.isStale()) return;
        }
        helpers.teardown();
        await helpers.commit();
        if (helpers.isStale()) return;

        mountEl.setAttribute("data-trans", "slide");
        await this.#runPhase(mountEl, "in");
    }

    /* -------- container zoom -------- */
    async #containerZoom({ mountEl, helpers }) {
        if (mountEl.childElementCount > 0) {
            mountEl.setAttribute("data-trans", "zoom");
            await this.#runPhase(mountEl, "out");
            if (helpers.isStale()) return;
        }
        helpers.teardown();
        await helpers.commit();
        if (helpers.isStale()) return;

        mountEl.setAttribute("data-trans", "zoom");
        await this.#runPhase(mountEl, "in");
    }

    /* -------- overlap push-left (slide-push) -------- */
    async #overlapPushLeft({ mountEl, helpers }) {
        const cs = getComputedStyle(mountEl);
        if (cs.position === "static") mountEl.style.position = "relative";
        if (cs.overflow !== "hidden") mountEl.style.overflow = "hidden";

        let oldSlot = null;
        if (mountEl.childNodes.length > 0) {
            oldSlot = document.createElement("div");
            oldSlot.className = "view-slot route-leave";
            oldSlot.style.position = "absolute";
            oldSlot.style.inset = "0";
            const frag = document.createDocumentFragment();
            while (mountEl.firstChild) frag.appendChild(mountEl.firstChild);
            oldSlot.appendChild(frag);
            mountEl.appendChild(oldSlot);
            oldSlot.setAttribute("data-trans", "slide-push");
            oldSlot.style.transform = "translateX(0%)";
        }

        helpers.teardown();

        const newSlot = document.createElement("div");
        newSlot.className = "view-slot route-enter";
        newSlot.style.position = "absolute";
        newSlot.style.inset = "0";
        newSlot.setAttribute("data-trans", "slide-push");
        mountEl.appendChild(newSlot);

        await helpers.commit(newSlot);
        if (helpers.isStale()) { newSlot.remove(); return; }

        // Animate both slots concurrently
        await Promise.all([
            this.#runPhase(newSlot, "in"),
            oldSlot ? this.#runPhase(oldSlot, "out") : Promise.resolve(),
        ]);

        if (helpers.isStale()) { newSlot.remove(); return; }

        oldSlot?.remove();
        const frag2 = document.createDocumentFragment();
        while (newSlot.firstChild) frag2.appendChild(newSlot.firstChild);
        mountEl.appendChild(frag2);
        newSlot.remove();
    }

    /* -------- track push (2 views side-by-side) -------- */
    async #trackPush({ mountEl, helpers }) {
        const track = document.createElement("div");
        track.className = "view-track route-enter";
        track.setAttribute("data-trans", "slide-push");
        mountEl.appendChild(track);

        const oldSlot = document.createElement("div");
        oldSlot.className = "view-slot";
        while (mountEl.firstChild !== track) {
            oldSlot.appendChild(mountEl.firstChild);
        }
        track.appendChild(oldSlot);

        const newSlot = document.createElement("div");
        newSlot.className = "view-slot";
        track.appendChild(newSlot);

        helpers.teardown();
        await helpers.commit(newSlot);

        if (helpers.isStale()) { track.remove(); return; }

        await this.#runPhase(track, "in");
    }

    /* -------- generic runner -------- */
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
                void el.offsetWidth;
                el.classList.add(phase === "out" ? "route-leave-active" : "route-enter-active");
                el.addEventListener("transitionend", onEnd, { once: true });
                const total = getMaxTransitionMs(el);
                setTimeout(finish, (total || 0) + 50);
            });
        });
    }
}
