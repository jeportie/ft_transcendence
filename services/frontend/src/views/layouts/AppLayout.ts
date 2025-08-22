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

import AbstractLayout from "./AbstractLayout.ts";

export default class AppLayout extends AbstractLayout {
    // keep a bound handler so destroy() can remove it
    #onToggle?: (e: Event) => void;

    async getHTML() {
        return /*html*/ `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <!-- Toggle button (visible on small screens) -->
        <button
          id="sidebar-toggle"
          class="md:hidden mb-2 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm"
          aria-controls="app-sidebar"
          aria-expanded="false"
        >
          Toggle menu
        </button>

        <!-- Sidebar wrapper for slide-in on mobile -->
        <aside
          id="app-sidebar"
          class="bg-slate-800/60 rounded-xl p-4 border border-slate-700
                 transform transition-transform duration-200 ease-in-out
                 -translate-x-full md:translate-x-0 md:static md:block fixed top-4 left-4 w-64 z-40"
        >
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/dashboard"         data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts"    data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
            <a href="/game"     data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
          </nav>
        </aside>

        <!-- A translucent backdrop when sidebar is open on mobile -->
        <div id="sidebar-backdrop"
             class="fixed inset-0 bg-black/40 opacity-0 pointer-events-none transition-opacity duration-200 md:hidden"></div>

        <main class="space-y-4 relative z-10">
          <!-- router-slot -->
        </main>
      </div>
    `;
    }

    mount() {
        const btn = document.getElementById("sidebar-toggle");
        const sidebar = document.getElementById("app-sidebar");
        const backdrop = document.getElementById("sidebar-backdrop");

        if (!btn || !sidebar || !backdrop) return;

        const open = () => {
            sidebar.classList.remove("-translate-x-full");
            (btn as HTMLButtonElement).setAttribute("aria-expanded", "true");
            backdrop.classList.remove("pointer-events-none");
            backdrop.classList.add("opacity-100");
        };

        const close = () => {
            sidebar.classList.add("-translate-x-full");
            (btn as HTMLButtonElement).setAttribute("aria-expanded", "false");
            backdrop.classList.add("pointer-events-none");
            backdrop.classList.remove("opacity-100");
        };

        const toggle = () => {
            const isClosed = sidebar.classList.contains("-translate-x-full");
            isClosed ? open() : close();
        };

        // keep a bound reference so destroy can remove
        this.#onToggle = (e: Event) => { e.preventDefault(); toggle(); };

        btn.addEventListener("click", this.#onToggle);

        // close when backdrop clicked (mobile)
        backdrop.addEventListener("click", close);

        // close when resizing to desktop to avoid weird states
        const onResize = () => {
            if (window.matchMedia("(min-width: 768px)").matches) {
                // desktop: ensure visible, remove backdrop effects
                sidebar.classList.remove("-translate-x-full");
                backdrop.classList.add("pointer-events-none");
                backdrop.classList.remove("opacity-100");
            } else {
                // mobile: start closed by default
                sidebar.classList.add("-translate-x-full");
            }
        };
        window.addEventListener("resize", onResize);
        // run once
        onResize();

        // store extra cleanup hooks
        (this as any)._cleanup = () => {
            btn.removeEventListener("click", this.#onToggle!);
            backdrop.removeEventListener("click", close);
            window.removeEventListener("resize", onResize);
        };
    }

    destroy() {
        (this as any)._cleanup?.();
    }
}

