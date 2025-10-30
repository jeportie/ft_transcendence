// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   init.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 19:49:43 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 19:54:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

export async function init() {
    const btn = DOM.settingsPwdBtn;
    if (!btn) return;
    const me = await API.Get("/user/me");
    const user = me?.data?.me;

    console.log(user);

    if (user?.oauth) {
        btn.innerText = "Create";
    } else {
        btn.innerText = "Change";
    }
}
