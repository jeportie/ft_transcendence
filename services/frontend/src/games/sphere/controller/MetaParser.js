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

export class MetaParser {
    static fromNavbar(selector = ".ui-sidebar a, .ui-sidebar button", geom) {
        const elements = document.querySelectorAll(selector);
        const meta = [];
        if (!geom?.COUNT) return meta;

        const step = Math.floor(geom.COUNT / (elements.length + 1));
        let i = step;

        elements.forEach((el, n) => {
            const color = ["#4ef0a9", "#e64f4f", "#f0e64f", "#66aaff"][n % 4];
            const name = el.textContent.trim() || el.id || `Link${n}`;
            meta.push({ name, element: el, idx: i, color });
            i += step;
        });

        return meta;
    }

    static getActiveName(meta) {
        const currentPath = window.location.pathname;
        for (const m of meta) {
            if (m.element.getAttribute("href") === currentPath)
                return m.name;
        }
        return meta.find(m => /logout/i.test(m.name)) ? null : null;
    }
}

