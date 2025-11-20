// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   F2A.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/20 11:35:28 by jeportie          #+#    #+#             //
//   Updated: 2025/11/20 11:50:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //
//
// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import f2aHTML from "./f2a.html";

export const ASSETS = {};

export default class F2A extends AbstractView {
    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
        this.setTitle("2FA");
    };
    getHTML() { return f2aHTML; }
    async mount() { await super.mount({ tasks, ASSETS }); }
    async destroy() { await super.destroy({ tasks }); }
}
