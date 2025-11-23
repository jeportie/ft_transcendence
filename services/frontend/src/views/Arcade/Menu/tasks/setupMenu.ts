// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupMenu.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/21 16:00:41 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 16:04:10 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { auth } from "@auth";

export async function setupMenu() {

    // Quick Match
    DOM.arcadeQuickBtn?.addEventListener("click", () => {
        window.navigateTo("/arcade/play");
    });

    // Tournament Mode
    DOM.arcadeTournamentBtn?.addEventListener("click", () => {
        window.navigateTo("/arcade/tournament");
    });
}
