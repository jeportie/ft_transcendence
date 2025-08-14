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
    constructor() {
        super();
        this.setTitle("Dashboard");
    };

    async getHTML() {
        return /* html */ `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Menu</h2>
                    <a href="/" class="nav-link" data-link>Dashboard</a>
                    <a href="/posts" class="nav-link" data-link>Posts</a>
                    <a href="/settings" class="nav-link" data-link>Settings</a>
                </aside>
                <main class="main">
                    <h1>Dashboard</h1>
                    <div class="card">
                        <p>Welcome to your SPA dashboard! Use the menu to navigate without reloading the page.</p>
                    </div>
                </main>
            </div>
        `;
    }
}
