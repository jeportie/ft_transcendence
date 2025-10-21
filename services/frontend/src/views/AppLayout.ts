// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppLayout.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:11:48 by jeportie          #+#    #+#             //
//   Updated: 2025/10/21 12:04:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import appLayoutHTML from "../html/appLayout.html";
import { runMenuSphere } from "../games/sphere/runMenuSphere.js";


export default class AppLayout extends AbstractLayout {
    #onToggle?: (e: Event) => void;
    #open = true;
    #cleanup?: () => void;
    #keepCanvas = true; // 🆕 just like LandingLayout

    async getHTML() {
        return appLayoutHTML;
    }

    mount() {
        this.#cleanup = runMenuSphere("#menu-canvas");
        this.#keepCanvas = true;

        const appLayout = document.querySelector("#app-layout");
        const btn = document.querySelector("#sidebar-toggle");
        const sidebar = document.querySelector("#app-sidebar");
        const logoutBtn = document.querySelector("#logout-btn");
        if (!appLayout || !btn || !sidebar || !logoutBtn) return;

        const apply = (state: "open" | "closed") => {
            appLayout.setAttribute("data-state", state);
            const expanded = state === "open";
            btn.setAttribute("aria-expanded", String(expanded));
            btn.textContent = expanded ? "Hide sidebar" : "Show sidebar";
            this.#open = expanded;
            localStorage.setItem("sidebar", state);
        };

        this.#onToggle = (e: Event) => {
            e.preventDefault();
            apply(this.#open ? "closed" : "open");
        };

        btn.addEventListener("click", this.#onToggle);

        logoutBtn.addEventListener("click", async () => {
            API.Post("/auth/logout");
            auth.clear();
            this.#keepCanvas = false; // 🆕 destroy Babylon on exit
            window.navigateTo("/login");
        });

        const saved = localStorage.getItem("sidebar");
        apply(saved === "closed" ? "closed" : "open");
    }

    /** Allow child views to force a full reload on layout exit */
    reloadOnExit() {
        this.#keepCanvas = false;
    }

    destroy() {
        if (!this.#keepCanvas) this.#cleanup?.(); // 🆕 Only destroy if requested
        const btn = document.querySelector("#sidebar-toggle");
        if (btn && this.#onToggle) btn.removeEventListener("click", this.#onToggle);
    }
}


