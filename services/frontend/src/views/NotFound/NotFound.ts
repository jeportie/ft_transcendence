// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   NotFound.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/16 19:51:07 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:23:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import notFoundHTML from "./notFound.html";

export default class NotFound extends AbstractView {
    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
        this.setTitle("NotFound");
    }

    async getHTML() {
        return (notFoundHTML);
    }
}
