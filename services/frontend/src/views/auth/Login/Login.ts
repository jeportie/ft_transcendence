// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 13:29:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import * as tasks from "./tasks/index.ts";
import loginHTML from "./login.html";

export default class Login extends AbstractView {
    constructor(ctx) {
        super(ctx);
        this.setTitle("Login");
    }

    async getHTML() {
        return loginHTML;
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        for (const fn of Object.values(tasks)) {
            if (typeof fn === "function")
                fn();
        }
    }
}
