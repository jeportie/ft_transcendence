// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:39:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import settingsHTML from "./settings.html";

import desktop from "../../../assets/icons/desktop.svg";
import laptop from "../../../assets/icons/laptop.svg";
import phone from "../../../assets/icons/phone.svg";

export const ASSETS = { desktop, laptop, phone };

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    };
    getHTML() { return settingsHTML; }
    async mount() { await super.mount({ tasks, ASSETS }); }
    async destroy() { await super.destroy({ tasks }); }
}
