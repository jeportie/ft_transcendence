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
        <h1 class="ui-title">Post ${id}</h1>
        <div class="ui-card">
          <p class="ui-text-muted">Details for post ${id}...</p>
        </div>
      `;
    }
}
