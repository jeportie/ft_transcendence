// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   magnifyingGlass.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/25 16:23:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 17:45:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { createRefractionFilter } from "../lib/refractionFilter";

export function setupMagnifyingGlass(root: HTMLElement) {
    const lens = root.querySelector<HTMLDivElement>(".lens");
    const lensImage = lens?.querySelector<HTMLImageElement>(".lens-image");
    if (!lens || !lensImage) return;

    // --- Create filter
    let current = createRefractionFilter({
        id: "liquid",
        magnify: true,
        width: 210,
        height: 150,
        specularOpacity: 0.5,
        specularSaturation: 9,
        scaleRatio: 1,
    });
    requestAnimationFrame(() => {
        lensImage.style.filter = `url(#${current.id})`;
    });

    // --- Keep image offset synced with lens position
    function syncInnerImageOffset() {
        const containerRect = root.getBoundingClientRect();
        const lensRect = lens.getBoundingClientRect();
        const x = lensRect.left - containerRect.left;
        const y = lensRect.top - containerRect.top;
        lensImage.style.left = `${-x}px`;
        lensImage.style.top = `${-y}px`;
    }
    syncInnerImageOffset();
    window.addEventListener("resize", syncInnerImageOffset);

    // --- Sliders
    const opacity = document.getElementById("specularOpacity") as HTMLInputElement;
    const sat = document.getElementById("specularSaturation") as HTMLInputElement;
    const refr = document.getElementById("refractionBase") as HTMLInputElement;

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
        });
        lensImage.style.filter = `url(#${current.id})`;
    }
    [opacity, sat, refr].forEach((s) => s.addEventListener("input", rebuild));

    // --- Drag logic
    let dragging = false;
    let offsetX = 0,
        offsetY = 0;

    lens.addEventListener("mousedown", (e) => {
        dragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        lens.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
        dragging = false;
        lens.style.cursor = "grab";
    });
    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const rect = root.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
        lensImage.style.left = `${-x}px`;
        lensImage.style.top = `${-y}px`;
    });
}
