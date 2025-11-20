// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupSidebar.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 09:09:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 23:34:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

let onToggle: ((e: Event) => void) | null = null;

export function setupSidebar() {
    const appLayout = DOM.appLayout;
    const btn = DOM.appSidebarToggleBtn;
    const sidebar = DOM.appSidebar;
    if (!appLayout || !btn || !sidebar) return;

    const apply = (state: "open" | "closed") => {
        appLayout.setAttribute("data-state", state);
        const expanded = state === "open";
        btn.setAttribute("aria-expanded", String(expanded));
        btn.textContent = expanded ? "Hide sidebar" : "Show sidebar";
        localStorage.setItem("sidebar", state);
    };

    const saved = localStorage.getItem("sidebar");
    apply(saved === "closed" ? "closed" : "open");

    onToggle = (e: Event) => {
        e.preventDefault();
        const next =
            appLayout.getAttribute("data-state") === "open" ? "closed" : "open";
        apply(next as "open" | "closed");
    };

    btn.addEventListener("click", onToggle);
}

export function teardownSidebar() {
    const btn = DOM.appSidebarToggleBtn;
    if (btn && onToggle) btn.removeEventListener("click", onToggle);
    onToggle = null;
}

