// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotFound.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/16 19:51:07 by jeportie          #+#    #+#             //
//   Updated: 2025/08/16 19:54:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class NotFound extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("NotFound");
    }

    async getHTML() {
        return (`
    <div class="min-h-screen grid grid-cols-[220px_1fr]">
      <aside class="bg-slate-800 text-white p-4">
        <h2 class="text-lg font-semibold mb-4">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" class="hover:underline" data-link>Dashboard</a>
          <a href="/posts" class="hover:underline" data-link>Posts</a>
          <a href="/settings" class="hover:underline" data-link>Settings</a>
        </nav>
      </aside>
      <main class="p-6">
        <h1 class="text-2xl font-bold mb-4">Not Found</h1>
        <div class="rounded-lg bg-rose-900 text-rose-100 p-4">
          Sorry, the page you are looking for was not found
        </div>
      </main>
    </div>
    `)
    };

}
