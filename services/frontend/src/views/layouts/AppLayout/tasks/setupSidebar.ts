// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupSidebar.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 09:09:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 09:14:48 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let onToggle: ((e: Event) => void) | null = null;

export function setupSidebar() {
    const appLayout = document.querySelector("#app-layout");
    const btn = document.querySelector("#sidebar-toggle");
    const sidebar = document.querySelector("#app-sidebar");

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
        const next = appLayout.getAttribute("data-state") === "open" ? "closed" : "open";
        apply(next as "open" | "closed");
    };

    btn.addEventListener("click", onToggle);
}

export function teardownSidebar() {
    const btn = document.querySelector("#sidebar-toggle");
    if (btn && onToggle) btn.removeEventListener("click", onToggle);
    onToggle = null;
}
