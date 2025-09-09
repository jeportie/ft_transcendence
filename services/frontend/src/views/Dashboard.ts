// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Dashboard.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:39:16 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:43:19 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import Fetch from "../tools/Fetch.js";

// API
const API = new Fetch("/api");

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Dashboard");
    };

    async getHTML() {
        return /*html*/ `
        <h1 class="ui-title">Dashboard</h1>
        <div class="ui-card">
          <p class="ui-text-muted">Welcome to your SPA dashboard!</p>
        </div>
        `;
    }

    mount() {
        API.get('/me').then(data => console.log("me:", data)).catch((err => console.error(err)));
    }
}
