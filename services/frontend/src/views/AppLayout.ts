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
            </aside>
    
            <main class="ui-main">
              <!-- router-slot -->
            </main>
          </div>
    
          <footer class="ui-footer">
            <button
              id="sidebar-toggle"
              class="ui-footer-btn"
              aria-controls="app-sidebar"
              aria-expanded="true"
            >
              Hide sidebar
            </button>
          </footer>
        </div>
        `;
    }

    mount() {
        const btnList = document.querySelectorAll("#sidebar-toggle");
        const sidebarList = document.querySelectorAll("#app-sidebar");
        const btn = (btnList[btnList.length - 1] ?? null) as HTMLButtonElement | null;
        const sidebar = (sidebarList[sidebarList.length - 1] ?? null) as HTMLElement | null;
        if (!btn || !sidebar) return;

        const open = () => {
            sidebar.classList.remove("w-0", "p-0", "border-0");
            sidebar.classList.add("w-[220px]", "p-4", "border");
            btn.setAttribute("aria-expanded", "true");
            btn.textContent = "Hide sidebar";
            this.#open = true;
            localStorage.setItem("sidebar", "open");
        };

        const close = () => {
            // collapse width & padding so it fully disappears
            sidebar.classList.remove("w-[220px]", "p-4", "border");
            sidebar.classList.add("w-0", "p-0", "border-0");
            btn.setAttribute("aria-expanded", "false");
            btn.textContent = "Show sidebar";
            this.#open = false;
            localStorage.setItem("sidebar", "closed");
        };

        const toggle = () => (this.#open ? close() : open());
        this.#onToggle = (e: Event) => { e.preventDefault(); toggle(); };

        btn.addEventListener("click", this.#onToggle);

        const saved = localStorage.getItem("sidebar");
        (saved === "closed") ? close() : open();

        (this as any)._cleanup = () => {
            btn.removeEventListener("click", this.#onToggle!);
        };
    }

    destroy() {
        (this as any)._cleanup?.();
    }
}

