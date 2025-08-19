// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotFound.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/16 19:51:07 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 20:05:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class NotFound extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("NotFound");
    }

    async getHTML() {
        return /*html*/ `
    <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
      <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <h2 class="text-lg font-semibold mb-3">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
          <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
          <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
          <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
        </nav>
      </aside>

      <main class="space-y-4">
        <h1 class="text-2xl font-bold">Not Found</h1>

        <div class="rounded-xl border border-rose-800 bg-rose-900/80 p-4">
          <p class="text-rose-100">Sorry, the page you are looking for was not found.</p>
        </div>
      </main>
    </div>
  `;
    }
}
