// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 22:43:06 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import loginHTML from "./login.html";

import spaceShipSvg from "../../../assets/spaceship.svg";
import googleIcon from "../../../assets/google.png";
import hideIcon from "../../../assets/hide.png";
import showIcon from "../../../assets/show.png";

export const ASSETS = { spaceShipSvg, googleIcon, hideIcon, showIcon };

export default class Login extends AbstractView {
    #cleanups = [];

    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Login");
    }

    async getHTML() {
        return loginHTML;
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        const context = {
            ASSETS,
            addCleanup: (fn) => this.#cleanups.push(fn),
        };
        if (tasks.init) {
            for (const fn of tasks.init) {
                const result = fn(context);
                if (result && typeof result === "object") {
                    Object.assign(context, result);
                }
            }
        }
        if (tasks.ready) {
            for (const fn of tasks.ready) fn(context);
        }
    }

    async destroy() {
        console.log("[Login] Running teardown tasks:", tasks.teardown?.map(f => f.name));

        for (const fn of this.#cleanups) {
            try {
                fn();
            } catch (err) {
                console.warn("Teardown error:", err);
            }
        }
        if (tasks.teardown) {
            for (const fn of tasks.teardown) {
                try {
                    fn();
                } catch (err) {
                    console.warn("Static teardown error:", err);
                }
            }
        }
        this.#cleanups = [];
    }
}
