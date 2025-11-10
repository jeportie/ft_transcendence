// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   F2aLogin.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 13:26:50 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-expect-error
import { AbstractView } from "@jeportie/mini-js";
import f2aLoginHTML from "./f2aLogin.html";
import { tasks } from "./tasks/index.js";


interface Layout {
    reloadOnExit?: () => void;
}

export default class F2aLogin extends AbstractView {
    layout?: Layout;

    constructor(ctx: any) {
        super(ctx);
        // @ts-expect-error
        this.setTitle("F2aLogin");
    }

    async getHTML() {
        return (f2aLoginHTML);
    }

    async mount() {
        this.layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }

}
