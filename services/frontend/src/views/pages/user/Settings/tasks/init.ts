// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 19:49:43 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 14:13:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { UserState } from "@system/core/user/UserState.js";

export async function init() {
    let user = await UserState.get();

    const btn = DOM.settingsPwdBtn;
    if (!btn) return;

    if (user?.oauth) {
        btn.innerText = "Create";
    } else {
        btn.innerText = "Change";
    }
}
