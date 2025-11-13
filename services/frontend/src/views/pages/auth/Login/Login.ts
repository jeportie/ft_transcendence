// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 15:51:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import loginHTML from "./login.html";

import spaceShipSvg from "@assets/spaceship.svg";
import googleIcon from "@assets/google.png";
import githubIcon from "@assets/github.png";
import fortyTwoIcon from "@assets/42.png";
import hideIcon from "@assets/hide.png";
import showIcon from "@assets/show.png";

export const ASSETS = { spaceShipSvg, googleIcon, githubIcon, fortyTwoIcon, hideIcon, showIcon };

export default class Login extends AbstractView {
    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
        this.setTitle("Login");
    }

    async getHTML() {
        return loginHTML;
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks, ASSETS });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
