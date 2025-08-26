// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotFound.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/16 19:51:07 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:15:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class NotFound extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("NotFound");
    }

    async getHTML() {
        return /*html*/ `
        <h1 class="ui-title">Not Found</h1>
        <div class="ui-card-error">
          <p class="ui-text-error">Sorry, the page you are looking for was not found.</p>
        </div>
        `;
    }
}
