// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 12:36:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { router } from "./router.ts"
import { navigateTo } from "./router.ts"

fetch('/health.json')
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(console.log)
    .catch(console.error);

console.log("TS is RUNNING!");

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.defaultPrevented)
            return;
        if (e.button !== 0)
            return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        const a = e.target.closest("[data-link]");
        if (!a)
            return;
        const url = new URL(a.href, window.location.origin);
        if (url.origin !== window.location.origin)
            return;
        if (a.target === "_blank" || a.hasAttribute("download") || a.getAttribute("rel") === "external")
            return;
        e.preventDefault();
        navigateTo(url.pathname + url.search + url.hash);
    });
    router();
});
