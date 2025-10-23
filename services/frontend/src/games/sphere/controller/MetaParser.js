// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   MetaParser.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 15:55:10 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 16:17:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export class MetaParser {
    static fromNavbar(geom, {
        linksSelector = ".ui-sidebar-nav a",
        logoutSelector = "#app-logout-btn",
    } = {}) {
        const links = [...document.querySelectorAll(linksSelector)];
        const logoutBtn = document.querySelector(logoutSelector);
        const meta = [];
        if (!geom?.COUNT) return meta;

        // distribute along front hemisphere
        const step = Math.floor(geom.COUNT / (links.length + 1));
        let i = step;

        links.forEach((el, n) => {
            const color = ["#4ef0a9", "#e64f4f", "#f0e64f", "#66aaff"][n % 4];
            meta.push({
                name: el.textContent.trim(),
                element: el,
                idx: i,        // anchor point index into geom.pos/rest
                href: el.getAttribute("href") || "",
                color,
            });
            i += step;
        });

        // Add logout as a virtual nav item (anchor near bottom/front)
        if (logoutBtn) {
            const color = "#ffaa66";
            const idx = Math.min(geom.COUNT - 1, i + Math.floor(step * 0.6));
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

