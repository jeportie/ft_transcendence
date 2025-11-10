// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotFound.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/16 19:51:07 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:39:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import notFoundHTML from "./notFound.html";

export default class NotFound extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("NotFound");
    }

    async getHTML() {
        return (notFoundHTML);
    }
}
