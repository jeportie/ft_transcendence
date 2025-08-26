// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppLayout.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:11:48 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:51:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractLayout } from "@jeportie/mini-spa";
import { auth } from "../tools/AuthService.js";

export default class AppLayout extends AbstractLayout {
    #onToggle?: (e: Event) => void;
    #open = true; // current state

    async getHTML() {
        return /*html*/ `
        <div id="app-layout" class="ui-app-layout">
          <div class="ui-app-wrapper">
            <aside id="app-sidebar" class="ui-sidebar">
              <h2 class="ui-sidebar-title">Menu</h2>
              <nav class="ui-sidebar-nav">
                <a href="/dashboard" data-link class="ui-sidebar-link">Dashboard</a>
                <a href="/posts"     data-link class="ui-sidebar-link">Posts</a>
                <a href="/settings"  data-link class="ui-sidebar-link">Settings</a>
                <a href="/game"      data-link class="ui-sidebar-link">Game</a>
              </nav>
              <button id="logout-btn" class="ui-sidebar-link">
                Logout
              </button>
            </aside>
    
            <main class="ui-main">
              <!-- router-slot -->
            </main>
          </div>
    
          <footer class="ui-footer">
            <button id="sidebar-toggle"class="ui-footer-btn"
              aria-controls="app-sidebar"
              aria-expanded="true">
              Hide sidebar
            </button>
          </footer>
        </div>
        `;
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
            auth.clear();
            window.navigateTo("/login");
        })

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

