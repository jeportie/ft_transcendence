// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PrivacyPolicy.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 16:28:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 16:30:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import privacyPolicyHTML from "../html/privacyPolicy.html";

export default class privacyPolicy extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Privacy Policy");
    }

    async getHTML() {
        return (privacyPolicyHTML);
    }

}
