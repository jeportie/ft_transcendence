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
    constructor(params) {
        super(params);
        this.setTitle("Posts");
    }

    async getHTML() {
        return (`
      <div class="dashboard">
        <aside class="sidebar">
          <h2>Menu</h2>
          <a href="/" class="nav-link" data-link>Dashboard</a>
          <a href="/posts" class="nav-link" data-link>Posts</a>
          <a href="/settings" class="nav-link" data-link>Settings</a>
        </aside>
        <main class="main">
          <h1>Posts</h1>
          <div class="card">
            <p>Recent posts</p>
            <ul>
              <li><a href="/posts/1" data-link>Routing without frameworks</a></li>
              <li><a href="/posts/2" data-link>State management 101</a></li>
              <li><a href="/posts/3" data-link>Fastify tips</a></li>
            </ul>
          </div>
        </main>
      </div>
    `)
    };
}
