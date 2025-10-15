// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ServiceTerms.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 16:27:02 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 16:28:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import serviceTermsHTML from "./serviceTerms.html";

export default class ServiceTerms extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Service Terms");
    }

    async getHTML() {
        return (serviceTermsHTML);
    }

}
