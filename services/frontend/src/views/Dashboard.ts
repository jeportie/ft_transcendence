// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Dashboard.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:39:16 by jeportie          #+#    #+#             //
//   Updated: 2025/08/14 19:08:24 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.ctx = ctx;
        this.setTitle("Dashboard");
    };

    async getHTML() {
        return /*html*/ `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
          </nav>
        </aside>
        <main class="space-y-4">
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <p class="text-slate-300">Welcome to your SPA dashboard!</p>
          </div>
        </main>
      </div>
    `;
    }
}
