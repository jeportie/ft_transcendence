// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/08/14 19:22:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class Settings extends AbstractView {
    constructor() {
        super();
        this.setTitle("Settings");
    };

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
          <h1>Settings</h1>
          <div class="card">
            <form id="settings-form">
              <div style="margin-bottom: .75rem;">
                <label for="name">Display name</label><br>
                <input id="name" name="name" type="text" placeholder="Your name" style="width:100%;padding:.5rem;border-radius:6px;border:0;outline:none;">
              </div>
              <div style="margin-bottom: .75rem;">
                <label for="theme">Theme</label><br>
                <select id="theme" name="theme" style="width:100%;padding:.5rem;border-radius:6px;border:0;outline:none;">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <button type="submit" class="nav-link" style="display:inline-block;background:#334155;">Save</button>
            </form>
          </div>
        </main>
      </div>
    `)
    };
}
