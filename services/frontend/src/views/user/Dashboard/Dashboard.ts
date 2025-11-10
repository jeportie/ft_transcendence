// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Dashboard.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:39:16 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 13:38:52 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-js";
import { tasks } from "./tasks/index.js";
import dashboardHTML from "./dashboard.html";

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Dashboard");
    };

    getHTML() {
        return (dashboardHTML);
    }

    async mount() {
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
