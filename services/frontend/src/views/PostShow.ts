// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PostShow.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:12:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:49:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import postShowHTML from "../html/postShow.html";

export default class PostShow extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle(`Post #${ctx.params.id ?? ""}`);
    }

    async getHTML() {
        const id = this.ctx.params.id;
        return (postShowHTML.replace(/\$\{id\}/g, id));
    }
}
