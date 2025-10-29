// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   magnifyingGlass.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/25 16:23:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 18:28:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { createRefractionFilter } from "../lib/refractionFilter";

/**
 * Backdrop-filter version (Chrome): the lens refracts true background content.
 * Sliders rebuild the SVG filter in-place.
 */
export function setupMagnifyingGlass(root: HTMLElement) {
    const lens = root.querySelector<HTMLDivElement>(".lens");
    if (!lens) return;

    // initial filter
    let current = createRefractionFilter({
        id: "liquid",
        magnify: true,
        width: 210,
        height: 150,
        specularOpacity: 0.5,
        specularSaturation: 9,
        scaleRatio: 1,
        magnifyingScale: 24,
    });

    // ensure the CSS sees it as a backdrop-filter target
    requestAnimationFrame(() => {
        (lens.style as any).backdropFilter = `url(#${current.id})`;
    });

    // sliders
    const opacity = document.getElementById("specularOpacity") as HTMLInputElement;
    const sat = document.getElementById("specularSaturation") as HTMLInputElement;
    const refr = document.getElementById("refractionBase") as HTMLInputElement;
    const mag = document.getElementById("magnifyScale") as HTMLInputElement;

    function rebuild() {
        const old = document.getElementById("liquid");
        if (old?.parentElement) old.parentElement.removeChild(old);

        current = createRefractionFilter({
            id: "liquid",
            magnify: true,
            width: 210,
            height: 150,
            specularOpacity: parseFloat(opacity.value),
            specularSaturation: parseFloat(sat.value),
            scaleRatio: parseFloat(refr.value),
            magnifyingScale: parseFloat(mag.value),
        });

        (lens.style as any).backdropFilter = `url(#${current.id})`;
    }

    [opacity, sat, refr, mag].forEach((s) => s.addEventListener("input", rebuild));

    // drag
    let dragging = false;
    let offX = 0, offY = 0;
    lens.addEventListener("mousedown", (e) => {
        dragging = true;
        offX = e.offsetX; offY = e.offsetY;
        lens.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
        dragging = false;
        lens.style.cursor = "grab";
    });
    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const rect = root.getBoundingClientRect();
        const x = e.clientX - rect.left - offX;
        const y = e.clientY - rect.top - offY;
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
    });
}

