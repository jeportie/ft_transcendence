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

import { AbstractView } from "@jeportie/mini-spa";

export default class Posts extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Posts");
    }

    async getHTML() {
        return /*html*/ `
        <h1 class="ui-title">Posts</h1>
        <div class="ui-card-solid">
          <p class="ui-text-muted mb-2">Recent posts</p>
          <ul class="ui-list">
            <li><a href="/posts/1" data-link class="ui-list-link">Routing without frameworks</a></li>
            <li><a href="/posts/2" data-link class="ui-list-link">State management 101</a></li>
            <li><a href="/posts/3" data-link class="ui-list-link">Fastify tips</a></li>
          </ul>
        </div>
        `;
    }
}
