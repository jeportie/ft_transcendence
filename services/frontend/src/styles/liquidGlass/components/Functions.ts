// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Functions.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:08:56 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:22:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// FunctionPlot.ts
import { generateFunctionPath } from "./generateFunctionPath";

/**
 * Create a standalone SVG element showing a function curve.
 */
export function createFunctionPlot(
    fn: (x: number) => number,
    options: { size?: number; pad?: number; samples?: number } = {}
): SVGSVGElement {
    const size = options.size ?? 128;
    const pad = options.pad ?? 11;
    const samples = options.samples ?? 96;

    const w = size;
    const h = size;
    const pathData = generateFunctionPath(fn, { size, pad, samples });

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", `${w}`);
    svg.setAttribute("height", `${h}`);
    svg.classList.add("function-plot");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0.5");
    rect.setAttribute("y", "0.5");
    rect.setAttribute("width", `${w - 1}`);
    rect.setAttribute("height", `${h - 1}`);
    rect.setAttribute("rx", "6");
    rect.classList.add("plot-bg");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.classList.add("plot-line");

    svg.append(rect, path);
    return svg;
}
