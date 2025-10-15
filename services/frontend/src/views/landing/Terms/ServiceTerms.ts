// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ServiceTerms.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 16:27:02 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 23:22:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import serviceTermsHTML from "./serviceTerms.html";
import { tasks } from "./tasks/index.js";

export default class ServiceTerms extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
        this.setTitle("Service Terms");
    }

    async getHTML() {
        return (serviceTermsHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
