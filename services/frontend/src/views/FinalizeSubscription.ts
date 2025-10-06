// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   FinalizeSubscription.ts                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 10:33:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 11:36:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import finalizeSubscriptionHTML from "../html/finalizeSubscription.html";

export default class FinalizeSubscription extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Finalize Subscription");
    }

    async getHTML() {
        return (finalizeSubscriptionHTML);
    }
    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();
    }
}
