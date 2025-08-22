// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Posts.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:12:34 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:16:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class Posts extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Posts");
    }

    async getHTML() {
        return /*html*/ `
        <h1 class="text-2xl font-bold">Posts</h1>

        <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <p class="text-slate-300 mb-2">Recent posts</p>
          <ul class="space-y-2">
            <li><a href="/posts/1" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">Routing without frameworks</a></li>
            <li><a href="/posts/2" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">State management 101</a></li>
            <li><a href="/posts/3" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">Fastify tips</a></li>
          </ul>
        </div>
  `;
    }


}
