// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refractionFilter.ts                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/25 10:44:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 17:45:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { calculateDisplacementMap, calculateDisplacementMap2 } from "./displacementMap";
import { calculateMagnifyingDisplacementMap } from "./magnifyingDisplacement";
import { calculateRefractionSpecular } from "./specular";
import { CONVEX, CONVEX_CIRCLE, CONCAVE, LIP } from "./surfaceEquations";
import { imageDataToUrl } from "./imageDataToUrl";

export interface RefractionFilterParams {
    id: string;
    width?: number;
    height?: number;
    radius?: number;
    bezelWidth?: number;
    glassThickness?: number;
    refractiveIndex?: number;
    bezelType?: "convex_circle" | "convex_squircle" | "concave" | "lip";
    blur?: number;
    scaleRatio?: number;
    specularOpacity?: number;
    specularSaturation?: number;
    magnify?: boolean;
    magnifyingScale?: number;
}

/**
 * Build an SVG <filter> containing displacement, specular and optional magnify maps.
 */
export function createRefractionFilter(options: RefractionFilterParams): SVGFilterElement {
    const {
        id,
        width = 150,
        height = 150,
        radius = Math.floor((width + height) / 4),
        bezelWidth = 40,
        glassThickness = 120,
        refractiveIndex = 1.5,
        bezelType = "convex_squircle",
        blur = 0.2,
        scaleRatio = 1,
        specularOpacity = 0.4,
        specularSaturation = 4,
        magnify = false,
        magnifyingScale = 1,
    } = options;

    // --- Surface profile
    let surfaceFn: (x: number) => number;
    switch (bezelType) {
        case "convex_circle":
            surfaceFn = CONVEX_CIRCLE.fn;
            break;
        case "concave":
            surfaceFn = CONCAVE.fn;
            break;
        case "lip":
            surfaceFn = LIP.fn;
            break;
        default:
            surfaceFn = CONVEX.fn;
    }

    const precomputed = calculateDisplacementMap(glassThickness, bezelWidth, surfaceFn, refractiveIndex);
    const maxDisplacement = Math.max(...precomputed.map((v) => Math.abs(v))) || 1;

    // --- Maps
    const disp = calculateDisplacementMap2(width, height, width, height, radius, bezelWidth, 100, precomputed, 1);
    const spec = calculateRefractionSpecular(width, height, radius, bezelWidth, undefined, 1);
    const dispUrl = imageDataToUrl(disp);
    const specUrl = imageDataToUrl(spec);
    const magnifyUrl = magnify ? imageDataToUrl(calculateMagnifyingDisplacementMap(width, height)) : null;

    // --- Ensure single global SVG <defs>
    const svgNS = "http://www.w3.org/2000/svg";
    let svg = document.querySelector<SVGSVGElement>("svg#liquid-glass-defs");
    let defs = svg?.querySelector("defs");
    if (!svg || !defs) {
        svg = document.createElementNS(svgNS, "svg");
        svg.id = "liquid-glass-defs";
        svg.style.display = "none";
        defs = document.createElementNS(svgNS, "defs");
        svg.appendChild(defs);
        document.body.appendChild(svg);
    }

    // --- Remove existing filter with same id
    const old = document.getElementById(id);
    if (old?.parentElement) old.parentElement.removeChild(old);

    // --- Build new filter
    const f = document.createElementNS(svgNS, "filter");
    f.setAttribute("id", id);
    f.setAttribute("color-interpolation-filters", "sRGB");

    // Optional magnifying pass
    if (magnify && magnifyUrl) {
        const feImgMag = document.createElementNS(svgNS, "feImage");
        feImgMag.setAttribute("href", magnifyUrl);
        feImgMag.setAttribute("width", String(width));
        feImgMag.setAttribute("height", String(height));
        feImgMag.setAttribute("result", "magnifying_displacement_map");
        f.appendChild(feImgMag);

        const feDispMag = document.createElementNS(svgNS, "feDisplacementMap");
        feDispMag.setAttribute("in", "SourceGraphic");
        feDispMag.setAttribute("in2", "magnifying_displacement_map");
        feDispMag.setAttribute("scale", String(magnifyingScale));
        feDispMag.setAttribute("xChannelSelector", "R");
        feDispMag.setAttribute("yChannelSelector", "G");
        feDispMag.setAttribute("result", "magnified_source");
        f.appendChild(feDispMag);
    }

    const feBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feBlur.setAttribute("in", magnify ? "magnified_source" : "SourceGraphic");
    feBlur.setAttribute("stdDeviation", String(blur));
    feBlur.setAttribute("result", "blurred_source");
    f.appendChild(feBlur);

    const feImgDisp = document.createElementNS(svgNS, "feImage");
    feImgDisp.setAttribute("href", dispUrl);
    feImgDisp.setAttribute("width", String(width));
    feImgDisp.setAttribute("height", String(height));
    feImgDisp.setAttribute("result", "displacement_map");
    f.appendChild(feImgDisp);

    const feDisp = document.createElementNS(svgNS, "feDisplacementMap");
    feDisp.setAttribute("in", "blurred_source");
    feDisp.setAttribute("in2", "displacement_map");
    feDisp.setAttribute("scale", String(40 * scaleRatio));
    feDisp.setAttribute("xChannelSelector", "R");
    feDisp.setAttribute("yChannelSelector", "G");
    feDisp.setAttribute("result", "displaced");
    f.appendChild(feDisp);

    const feSat = document.createElementNS(svgNS, "feColorMatrix");
    feSat.setAttribute("in", "displaced");
    feSat.setAttribute("type", "saturate");
    feSat.setAttribute("values", String(specularSaturation));
    feSat.setAttribute("result", "displaced_saturated");
    f.appendChild(feSat);

    const feImgSpec = document.createElementNS(svgNS, "feImage");
    feImgSpec.setAttribute("href", specUrl);
    feImgSpec.setAttribute("width", String(width));
    feImgSpec.setAttribute("height", String(height));
    feImgSpec.setAttribute("result", "specular_layer");
    f.appendChild(feImgSpec);

    const feComp = document.createElementNS(svgNS, "feComposite");
    feComp.setAttribute("in", "displaced_saturated");
    feComp.setAttribute("in2", "specular_layer");
    feComp.setAttribute("operator", "in");
    feComp.setAttribute("result", "specular_saturated");
    f.appendChild(feComp);

    const feTrans = document.createElementNS(svgNS, "feComponentTransfer");
    feTrans.setAttribute("in", "specular_layer");
    feTrans.setAttribute("result", "specular_faded");
    const feFuncA = document.createElementNS(svgNS, "feFuncA");
    feFuncA.setAttribute("type", "linear");
    feFuncA.setAttribute("slope", String(specularOpacity));
    feTrans.appendChild(feFuncA);
    f.appendChild(feTrans);

    const feBlend1 = document.createElementNS(svgNS, "feBlend");
    feBlend1.setAttribute("in", "specular_saturated");
    feBlend1.setAttribute("in2", "displaced");
    feBlend1.setAttribute("mode", "normal");
    feBlend1.setAttribute("result", "withSaturation");
    f.appendChild(feBlend1);

    const feBlend2 = document.createElementNS(svgNS, "feBlend");
    feBlend2.setAttribute("in", "specular_faded");
    feBlend2.setAttribute("in2", "withSaturation");
    feBlend2.setAttribute("mode", "normal");
    f.appendChild(feBlend2);

    defs.appendChild(f);
    return f;
}

export function debugShowImageData(imageData: ImageData, label = "debug") {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(imageData, 0, 0);
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.moveTo(imageData.width / 2, 0);
    ctx.lineTo(imageData.width / 2, imageData.height);
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, imageData.height / 2);
    ctx.lineTo(imageData.width, imageData.height / 2);
    ctx.stroke();

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
    position: fixed;
    right: 0;
    background: #000;
    border: 1px solid #444;
    margin-bottom: 8px;
    z-index: 9999;
    font: 10px monospace;
    color: white;
  `;
    const caption = document.createElement("div");
    caption.textContent = label;
    caption.style.cssText = "padding:2px 4px;background:#111;color:#fff;";
    wrapper.append(caption, canvas);

    // stack vertically
    const prev = document.querySelectorAll(".debug-image-wrapper").length;
    wrapper.classList.add("debug-image-wrapper");
    wrapper.style.top = `${8 + prev * (canvas.height + 20)}px`;

    document.body.append(wrapper);
}

