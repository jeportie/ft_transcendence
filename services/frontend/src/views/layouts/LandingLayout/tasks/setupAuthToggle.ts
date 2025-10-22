// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupAuthToggle.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/22 15:58:49 by jeportie          #+#    #+#             //
//   Updated: 2025/10/22 15:59:52 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let obs: MutationObserver | null = null;
let onPop: (() => void) | null = null;

export function setupAuthToggle() {
    const outlet = document.querySelector("[data-router-outlet]");
    if (outlet) {
        obs = new MutationObserver(updateAuthToggle);
        obs.observe(outlet, { childList: true, subtree: true });
    }
    onPop = () => updateAuthToggle();
    window.addEventListener("popstate", onPop);
    updateAuthToggle();
}

export function teardownAuthToggle() {
    obs?.disconnect();
    if (onPop) window.removeEventListener("popstate", onPop);
    obs = null;
    onPop = null;
}

function updateAuthToggle() {
    const a = document.getElementById("auth-toggle") as HTMLAnchorElement | null;
    if (!a) return;
    const path = window.location.pathname;
    a.href = path === "/login" ? "/" : "/login";
    a.setAttribute("data-link", "");
}
