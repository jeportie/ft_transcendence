// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Posts.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:12:34 by jeportie          #+#    #+#             //
//   Updated: 2025/08/14 19:17:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class Posts extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Posts");
    }

    async getHTML() {
        return (`
    <div class="grid grid-cols-[200px_1fr] min-h-screen">
      <aside class="bg-slate-800 text-white p-4">
        <h2 class="text-lg font-semibold mb-4">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" class="hover:underline" data-link>Dashboard</a>
          <a href="/posts" class="hover:underline" data-link>Posts</a>
          <a href="/settings" class="hover:underline" data-link>Settings</a>
        </nav>
      </aside>
      <main class="p-6">
        <h1 class="text-2xl font-bold mb-4">Posts</h1>
        <div class="rounded-lg bg-slate-800 text-white p-4">
          <p class="mb-2 text-slate-300">Recent posts</p>
          <ul class="space-y-2">
            <li><a href="/posts/1" data-link class="text-blue-400 hover:underline">Routing without frameworks</a></li>
            <li><a href="/posts/2" data-link class="text-blue-400 hover:underline">State management 101</a></li>
            <li><a href="/posts/3" data-link class="text-blue-400 hover:underline">Fastify tips</a></li>
          </ul>
        </div>
      </main>
    </div>
  `)
    };
}
