// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupLogout.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 09:11:06 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 16:50:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { auth } from "../../../../spa/auth.js";
import { DOM } from "../dom.generated.js";

let onLogout: ((e: Event) => void) | null = null;

export function setupLogout() {
    const logoutBtn = DOM.appLogoutBtn;
    if (!logoutBtn) return;

    onLogout = async (e: Event) => {
        e.preventDefault();
        await API.Post("/auth/logout");
        auth.clear();
        window.navigateTo("/login");
    };

    logoutBtn.addEventListener("click", onLogout);
}

export function teardownLogout() {
    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn && onLogout) logoutBtn.removeEventListener("click", onLogout);
    onLogout = null;
}
