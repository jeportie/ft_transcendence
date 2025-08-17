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
    constructor(params) {
        super(params);
        this.setTitle("NotFound");
    }
    async getHTML() {
        return (`
      <div class="notfound">
        <aside class="sidebar">
          <h2>Menu</h2>
          <a href="/" class="nav-link" data-link>Dashboard</a>
          <a href="/posts" class="nav-link" data-link>Posts</a>
          <a href="/settings" class="nav-link" data-link>Settings</a>
        </aside>
        <main class="main">
          <h1>NotFound</h1>
          <p>This page was not found</p>
        </main>
      </div>
    `)
    };
}
