// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 00:53:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-js";
import { tasks } from "./tasks/index.js";
import loginHTML from "./login.html";

import spaceShipSvg from "../../../assets/spaceship.svg";
import googleIcon from "../../../assets/google.png";
import hideIcon from "../../../assets/hide.png";
import showIcon from "../../../assets/show.png";

export const ASSETS = { spaceShipSvg, googleIcon, hideIcon, showIcon };

export default class Login extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
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
