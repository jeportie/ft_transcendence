// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Dashboard.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:39:16 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:34:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "./tasks/index.js";
import dashboardHTML from "./dashboard.html";

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
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
