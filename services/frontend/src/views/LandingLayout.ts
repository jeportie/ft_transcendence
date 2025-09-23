// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LandingLayout.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:33:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import { runParticle } from "../games/particles/particleAnimation";
import landingLayoutHTML from "../html/landingLayout.html";

export default class LandingLayout extends AbstractLayout {
    #cleanup?: () => void;
    #keepCanvas = true;
    #obs?: MutationObserver;
    #onPop?: () => void;

    async getHTML() {
        return (landingLayoutHTML);
    }

    mount() {
        this.#cleanup = runParticle("#hero-canvas");
        this.#keepCanvas = true; // reset on (re)mount of the layout

        // initial toggle
        this.#updateAuthToggle();

        // update on overlay swaps (leaf-only commits change outlet DOM)
        const outlet = document.querySelector("[data-router-outlet]");
        if (outlet) {
            this.#obs = new MutationObserver(() => this.#updateAuthToggle());
            this.#obs.observe(outlet, { childList: true, subtree: true });
        }

        // update on back/forward
        this.#onPop = () => this.#updateAuthToggle();
        window.addEventListener("popstate", this.#onPop);
    }

    /** Public helper: allow child views to request a full reload on layout exit */
    reloadOnExit() {
        this.#keepCanvas = false;
    }

    destroy() {
        this.#obs?.disconnect();
        if (this.#onPop) window.removeEventListener("popstate", this.#onPop);
        // Only tear down the canvas if a child opted into reloading
        if (!this.#keepCanvas) this.#cleanup?.();
    }

    #updateAuthToggle() {
        const a = document.getElementById("auth-toggle") as HTMLAnchorElement | null;
        if (!a) return;
        const path = window.location.pathname;
        const onLogin = path === "/login";
        const onLanding = path === "/";

        // Toggle destination + label between Landing and Login
        if (onLogin) {
            a.href = "/";
        } else if (onLanding) {
            a.href = "/login";
        } else {
            a.href = "/login";
        }
        a.setAttribute("data-link", "");
    }
}
