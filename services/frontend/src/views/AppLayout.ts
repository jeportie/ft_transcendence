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
      <div id="app-layout" class="min-h-screen flex flex-col">
        <div class="flex gap-6 p-6 flex-1 items-start">
          <aside
            id="app-sidebar"
            class="w-[220px] shrink-0 overflow-hidden
                   transition-[width,padding] duration-200 ease-in-out
                   rounded-xl bg-slate-800/60 border border-slate-700 p-4"
          >
            <h2 class="text-lg font-semibold mb-3">Menu</h2>
            <nav class="flex flex-col gap-2">
              <a href="/dashboard" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
              <a href="/posts"     data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
              <a href="/settings"  data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
              <a href="/game"      data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
            </nav>
          </aside>

          <main class="flex-1 min-w-0 space-y-4">
            <!-- router-slot -->
          </main>
        </div>

        <footer class="border-t border-slate-700 p-3 flex">
          <button
            id="sidebar-toggle"
            class="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm"
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

