// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   SurfaceEquationSelector.ts                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:15:49 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:23:48 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { MotionValue, useTransform } from "../lib/motion";
import {
    ConvexCircleButton,
    ConvexSquircleButton,
    ConcaveButton,
    LipButton,
} from "./Buttons";

export type SurfaceType =
    | "convex_circle"
    | "convex_squircle"
    | "concave"
    | "lip";

export interface SurfaceEquationSelectorOptions {
    surface: MotionValue<SurfaceType>;
    onSurfaceChange?: (surface: SurfaceType) => void | Promise<void>;
}

/**
 * Create a vanilla JS SurfaceEquationSelector (no React).
 */
export function createSurfaceEquationSelector({
    surface,
    onSurfaceChange,
}: SurfaceEquationSelectorOptions): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "surface-selector flex items-center gap-3";

    const handleSelect = async (newSurface: SurfaceType) => {
        surface.set(newSurface);
        if (onSurfaceChange) await onSurfaceChange(newSurface);
    };

    // Each button uses a derived MotionValue<boolean> for active state
    const btnCircle = ConvexCircleButton({
        active: useTransform(surface, (s) => s === "convex_circle"),
        onClick: () => handleSelect("convex_circle"),
    });

    const btnSquircle = ConvexSquircleButton({
        active: useTransform(surface, (s) => s === "convex_squircle"),
        onClick: () => handleSelect("convex_squircle"),
    });

    const btnConcave = ConcaveButton({
        active: useTransform(surface, (s) => s === "concave"),
        onClick: () => handleSelect("concave"),
    });

    const btnLip = LipButton({
        active: useTransform(surface, (s) => s === "lip"),
        onClick: () => handleSelect("lip"),
    });

    container.append(btnCircle, btnSquircle, btnConcave, btnLip);
    return container;
}
