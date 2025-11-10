// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ResetPwd.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 14:04:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import resetHTML from "./resetPwd.html";
import { tasks } from "./tasks/index.js";

export default class ResetPwd extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Reset Pwd");
    }

    async getHTML() {
        return (resetHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
