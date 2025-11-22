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

    // Login
    DOM.arcadeLoginBtn?.addEventListener("click", () => {
        window.navigateTo("/login");
    });

    // Continue as guest
    DOM.arcadeGuestBtn?.addEventListener("click", () => {
        // Universal rule:
        // Set a temporary guest identity in localStorage or memory
        localStorage.setItem("pong_guest", "1");
        window.navigateTo("/arcade/play");
    });
}
