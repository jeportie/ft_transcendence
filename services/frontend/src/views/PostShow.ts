// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PostShow.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:12:46 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:13:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class PostShow extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle(`Post #${ctx.params.id ?? ""}`);
    }

    async getHTML() {
        const id = this.ctx.params.id;
        return /*html*/ `
      <h1 class="text-2xl font-bold">Post ${id}</h1>
      <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
        <p class="text-slate-300">Details for post ${id}...</p>
      </div>
    `;
    }
}
