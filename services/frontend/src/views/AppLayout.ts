// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppLayout.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:11:48 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:24:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import appLayoutHTML from "../html/appLayout.html";

export default class AppLayout extends AbstractLayout {
    #onToggle?: (e: Event) => void;
    #open = true; // current state

    async getHTML() {
        return (appLayoutHTML);
    }

    mount() {
        // DOM
        const appLayout = document.querySelector("#app-layout")
        const btnList = document.querySelectorAll("#sidebar-toggle");
        const sidebarList = document.querySelectorAll("#app-sidebar");
        const logoutBtn = document.querySelector("#logout-btn");
        if (!appLayout || !btnList || !sidebarList || !logoutBtn) return;

        const btn = (btnList[btnList.length - 1] ?? null) as HTMLButtonElement | null;
        const sidebar = (sidebarList[sidebarList.length - 1] ?? null) as HTMLElement | null;
        if (!btn || !sidebar) return;

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

        logoutBtn.addEventListener("click", () => {
            API.post("/auth/logout")
                .then(() => {
                    auth.clear(); // clear local token
                    window.navigateTo("/login");
                })
                .catch((err) => {
                    console.error("❌ Logout failed:", err);
                    auth.clear();
                    window.navigateTo("/login");
                });
        });

        const saved = localStorage.getItem("sidebar");
        apply(saved === "closed" ? "closed" : "open");

        (this as any)._cleanup = () => {
            btn.removeEventListener("click", this.#onToggle!);
        };
    }

    destroy() {
        (this as any)._cleanup?.();
    }
}

