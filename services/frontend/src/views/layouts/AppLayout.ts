// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppLayout.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:11:48 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:12:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractLayout from "./AbstractLayout.ts";

export default class AppLayout extends AbstractLayout {
    async getHTML() {
        // NOTE: <!-- router-slot --> is where the child view HTML will be injected
        return /*html*/ `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/"        data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts"   data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings"data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
            <a href="/game"    data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
          </nav>
        </aside>
        <main class="space-y-4">
          <!-- router-slot -->
        </main>
      </div>
    `;
    }
}
