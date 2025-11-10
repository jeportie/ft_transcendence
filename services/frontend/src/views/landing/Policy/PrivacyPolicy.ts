// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   PrivacyPolicy.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 16:28:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 23:21:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-js";
import privacyPolicyHTML from "./privacyPolicy.html";
import { tasks } from "./tasks/index.js";

export default class privacyPolicy extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
        this.setTitle("Privacy Policy");
    }

    async getHTML() {
        return (privacyPolicyHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
