// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MetaParser.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 15:55:10 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 18:10:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export class MetaParser {
    static fromNavbar(
        geom,
        { linksSelector = ".app-sidebar-nav a", logoutSelector = "#app-logout-btn" } = {}
    ) {
        const links = [...document.querySelectorAll(linksSelector)];
        const logoutBtn = document.querySelector(logoutSelector);
        const meta = [];
        if (!geom?.COUNT || !geom.rest) return meta;

        const { rest } = geom;

        // --- evenly distribute links across front hemisphere by index
        const step = Math.floor(geom.COUNT / (links.length + 1));
        let i = step;

        // --- Regular links
        links.forEach((el, n) => {
            const color = ["#4ef0a9", "#e64f4f", "#f0e64f", "#66aaff"][n % 4];
            meta.push({
                name: el.textContent.trim(),
                element: el,
                idx: i,
                href: el.getAttribute("href") || "",
                color,
            });
            i += step;
        });

        // --- Logout: choose one real vertex on front & lower hemisphere
        if (logoutBtn) {
            const color = "#ffaa66";

            // gather all candidate points that are in front (z>0.1) and lower (y< -0.4)
            const candidates = rest
                .map((v, idx) => ({ idx, v }))
                .filter(({ v }) => v.z > 0.1 && v.y < -0.4);

            // pick one farthest from any existing link indices (avoid overlap)
            let idx = Math.floor(geom.COUNT * 0.9);
            if (candidates.length) {
                const used = new Set(meta.map(m => m.idx));
                // prefer one whose index differs the most from used ones
                const scored = candidates.map(c => {
                    const dist = [...used].reduce((a, b) => a + Math.abs(c.idx - b), 0);
                    return { ...c, score: dist };
                });
                scored.sort((a, b) => b.score - a.score);
                idx = scored[0].idx;
            }

            meta.push({
                name: "Logout",
                element: logoutBtn,
                idx,
                href: "/logout",
                color,
                isLogout: true,
            });
        }

        return meta;
    }
}
