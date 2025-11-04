// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 19:49:43 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 16:37:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";
import { UserState } from "../../../../spa/UserState.js";

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
