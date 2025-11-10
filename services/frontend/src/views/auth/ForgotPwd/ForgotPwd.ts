// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ForgotPwd.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 18:59:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import forgotHTML from "./forgotPwd.html";

export default class Forgot extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
        this.setTitle("Forgot");
    }

    async getHTML() {
        return (forgotHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
