// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:57:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import settingsHTML from "./settings.html";

import desktop from "@assets/icons/desktop.svg";
import laptop from "@assets/icons/laptop.svg";
import phone from "@assets/icons/phone.svg";
import hideIcon from "@assets/icons/hide.svg";
import showIcon from "@assets/icons/show.svg";
import copyIcon from "@assets/icons/copy.svg";

export const ASSETS = { desktop, laptop, phone, hideIcon, showIcon, copyIcon };

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
        this.setTitle("Settings");
    };
    getHTML() { return settingsHTML; }
    async mount() { await super.mount({ tasks, ASSETS }); }
    async destroy() { await super.destroy({ tasks }); }
}
