// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Signup.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:12:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "../Signup/tasks/index.js";
import signupHTML from "./signup.html";

import spaceShipSvg from "@assets/spaceship.svg";
import googleIcon from "@assets/google.png";
import githubIcon from "@assets/github.png";
import fortyTwoIcon from "@assets/42.png";
import hideIcon from "@assets/hide.png";
import showIcon from "@assets/show.png";

export const ASSETS = { spaceShipSvg, googleIcon, githubIcon, fortyTwoIcon, hideIcon, showIcon };

export default class Signup extends AbstractView {
    constructor(ctx: any, logger: any) {
        super(ctx, logger);
        // @ts-expect-error
        this.setTitle("Signup");
    }

    async getHTML() {
        return (signupHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks, ASSETS });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
