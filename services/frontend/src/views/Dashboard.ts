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

import AbstractView from "./AbstractView.js";

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.ctx = ctx;
        this.setTitle("Dashboard");
    };

    async getHTML() {
        return /*html*/ `
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <p class="text-slate-300">Welcome to your SPA dashboard!</p>
          </div>
    `;
    }
}
