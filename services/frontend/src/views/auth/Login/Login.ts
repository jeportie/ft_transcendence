// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 10:39:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import loginHTML from "./login.html";
import * as task from "./logic/index.ts";

export default class Login extends AbstractView {
    constructor(ctx) {
        super(ctx);
        this.setTitle("Login");
    }

    async getHTML() {
        return loginHTML;
    }

    mount() {
        (this as any).layout?.reloadOnExit?.();

        task.tooglePwd();
        task.setupLogoAnimation();
        task.showActivationMessages();
        task.handleLogin();
        task.handleGoogleLogin();
    }
}
