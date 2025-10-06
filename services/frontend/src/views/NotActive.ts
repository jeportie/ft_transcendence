// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotActive.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 10:33:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 10:41:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import notActiveHTML from "../html/notActive.html";

export default class NotActive extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("NotActive");
    }

    async getHTML() {
        return (notActiveHTML);
    }
    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();
    }
}
