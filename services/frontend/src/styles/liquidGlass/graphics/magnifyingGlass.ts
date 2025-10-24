// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   magnifyingGlass.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:59:33 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:55:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { MotionValue, useSpring, useTransform } from "../lib/motion";
import { createMagnifyingFilter } from "../lib/filterGenerator"; // ✅ add filter generator

export function setupMagnifyingGlass(root: HTMLElement) {
    // --- DOM
    const lens = root.querySelector<HTMLDivElement>(".lens");
    const img = root.querySelector<HTMLImageElement>(".background");

    // Optional inputs (for demos)
    const inputs = {
        specularOpacity: root.querySelector<HTMLInputElement>("#specularOpacity"),
        specularSaturation: root.querySelector<HTMLInputElement>("#specularSaturation"),
        refractionBase: root.querySelector<HTMLInputElement>("#refractionBase"),
    };

    // --- Early guards
    if (!lens) {
        console.warn("[LiquidGlass] No .lens element found");
        return;
    }

    // --- 🔹 Create the SVG filter dynamically
    const filterUrl = createMagnifyingFilter("magnifying-glass-filter", 210, 150);
    lens.style.backdropFilter = filterUrl;
    lens.style.webkitBackdropFilter = filterUrl; // Safari support

    // --- Motion values
    const isDragging = new MotionValue(false);
    const velocityX = new MotionValue(0);

    const specularOpacity = new MotionValue(
        inputs.specularOpacity ? parseFloat(inputs.specularOpacity.value) : 0.5
    );
    const specularSaturation = new MotionValue(
        inputs.specularSaturation ? parseFloat(inputs.specularSaturation.value) : 9
    );
    const refractionBase = new MotionValue(
        inputs.refractionBase ? parseFloat(inputs.refractionBase.value) : 1
    );

    // --- Springs and transforms
    const dragMultiplier = useTransform(isDragging, d => (d ? 1 : 0.8));
    const refractionLevel = useSpring(
        useTransform(refractionBase, v => v * dragMultiplier.get()),
        { stiffness: 250, damping: 14 }
    );
    const magnifyingScale = useSpring(
        useTransform(isDragging, d => (d ? 48 : 24)),
        { stiffness: 250, damping: 14 }
    );
    const objectScale = useSpring(
        useTransform(isDragging, d => (d ? 1 : 0.8)),
        { stiffness: 340, damping: 20 }
    );
    const shadowAlpha = useSpring(
        useTransform(isDragging, d => (d ? 0.22 : 0.16)),
        { stiffness: 220, damping: 24 }
    );

    // --- Interactions
    let offsetX = 0, offsetY = 0;
    let drag = false;

    lens.addEventListener("mousedown", (e) => {
        drag = true;
        isDragging.set(true);
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        lens.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
        drag = false;
        isDragging.set(false);
        lens.style.cursor = "grab";
    });

    window.addEventListener("mousemove", (e) => {
        if (!drag) return;
        const rect = root.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        lens.style.left = `${x}px`;
        lens.style.top = `${y}px`;
    });

    // --- Reactive rendering loop
    const render = () => {
        lens.style.transform = `scale(${objectScale.get()})`;
        lens.style.boxShadow = `0 4px 24px rgba(0,0,0,${shadowAlpha.get()})`;
        requestAnimationFrame(render);
    };
    render();

    // --- Input bindings
    if (inputs.specularOpacity) {
        inputs.specularOpacity.addEventListener("input", e =>
            specularOpacity.set(parseFloat((e.target as HTMLInputElement).value))
        );
    }
    if (inputs.specularSaturation) {
        inputs.specularSaturation.addEventListener("input", e =>
            specularSaturation.set(parseFloat((e.target as HTMLInputElement).value))
        );
    }
    if (inputs.refractionBase) {
        inputs.refractionBase.addEventListener("input", e =>
            refractionBase.set(parseFloat((e.target as HTMLInputElement).value))
        );
    }
}

