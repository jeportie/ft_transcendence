// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   BackupLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 15:20:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import backupLoginHTML from "./backupLogin.html";
import { tasks } from "./tasks/index.js";

export default class BackupLogin extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("BackupLogin");
    }

    async getHTML() {
        return (backupLoginHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();
        await super.mount({ tasks });
    }

    async destroy() {
        await super.destroy({ tasks });
    }
}
