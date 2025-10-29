// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   refractionFilter.ts                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/25 10:44:52 by jeportie          #+#    #+#             //
//   Updated: 2025/10/25 18:30:10 by jeportie         ###   ########.fr       //
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
 * Build an SVG <filter> suitable for use as a CSS backdrop-filter in Chrome.
 * Important: we use userSpaceOnUse so pixel assets align with element bounds.
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
        blur = 0,
        scaleRatio = 1,
        specularOpacity = 0.5,
        specularSaturation = 9,
        magnify = true,
        magnifyingScale = 24, // stronger default so zoom is obvious
    } = options;

    // pick surface profile
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

    // 1D refraction profile + 2D maps
    const precomputed = calculateDisplacementMap(glassThickness, bezelWidth, surfaceFn, refractiveIndex);
    const disp = calculateDisplacementMap2(width, height, width, height, radius, bezelWidth, 100, precomputed, 1);
    const spec = calculateRefractionSpecular(width, height, radius, bezelWidth, undefined, 1);

    const dispUrl = imageDataToUrl(disp);
    const specUrl = imageDataToUrl(spec);
    const magnifyUrl = magnify ? imageDataToUrl(calculateMagnifyingDisplacementMap(width, height)) : null;

    // single hidden <svg><defs>
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

    // replace old filter with same id
    const old = document.getElementById(id);
    if (old?.parentElement) old.parentElement.removeChild(old);

    // filter — IMPORTANT: userSpaceOnUse and explicit bounds for backdrop-filter
    const f = document.createElementNS(svgNS, "filter");
    f.setAttribute("id", id);
    f.setAttribute("color-interpolation-filters", "sRGB");
    f.setAttribute("filterUnits", "userSpaceOnUse");
    f.setAttribute("primitiveUnits", "userSpaceOnUse");
    f.setAttribute("x", "0");
    f.setAttribute("y", "0");
    f.setAttribute("width", String(width));
    f.setAttribute("height", String(height));

    // optional magnifying pre-pass (moves pixels radially)
    if (magnify && magnifyUrl) {
        const feImgMag = document.createElementNS(svgNS, "feImage");
        feImgMag.setAttribute("href", magnifyUrl);
        feImgMag.setAttribute("x", "0");
        feImgMag.setAttribute("y", "0");
        feImgMag.setAttribute("width", String(width));
        feImgMag.setAttribute("height", String(height));
        feImgMag.setAttribute("preserveAspectRatio", "none");
        feImgMag.setAttribute("result", "magnifying_displacement_map");
        f.appendChild(feImgMag);

        const feDispMag = document.createElementNS(svgNS, "feDisplacementMap");
        feDispMag.setAttribute("in", "SourceGraphic");
        feDispMag.setAttribute("in2", "magnifying_displacement_map");
        feDispMag.setAttribute("scale", String(magnifyingScale)); // e.g. 24..48
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

    // refraction displacement
    const feImgDisp = document.createElementNS(svgNS, "feImage");
    feImgDisp.setAttribute("href", dispUrl);
    feImgDisp.setAttribute("x", "0");
    feImgDisp.setAttribute("y", "0");
    feImgDisp.setAttribute("width", String(width));
    feImgDisp.setAttribute("height", String(height));
    feImgDisp.setAttribute("preserveAspectRatio", "none");
    feImgDisp.setAttribute("result", "displacement_map");
    f.appendChild(feImgDisp);

    const feDisp = document.createElementNS(svgNS, "feDisplacementMap");
    feDisp.setAttribute("in", "blurred_source");
    feDisp.setAttribute("in2", "displacement_map");
    feDisp.setAttribute("scale", String(40 * scaleRatio)); // base 40 feels nice
    feDisp.setAttribute("xChannelSelector", "R");
    feDisp.setAttribute("yChannelSelector", "G");
    feDisp.setAttribute("result", "displaced");
    f.appendChild(feDisp);

    // (optional) color boost before specular
    const feSat = document.createElementNS(svgNS, "feColorMatrix");
    feSat.setAttribute("in", "displaced");
    feSat.setAttribute("type", "saturate");
    feSat.setAttribute("values", String(specularSaturation));
    feSat.setAttribute("result", "displaced_saturated");
    f.appendChild(feSat);

    // specular rim (now with bloom + screen blend)
    const feImgSpec = document.createElementNS(svgNS, "feImage");
    feImgSpec.setAttribute("href", specUrl);
    feImgSpec.setAttribute("x", "0");
    feImgSpec.setAttribute("y", "0");
    feImgSpec.setAttribute("width", String(width));
    feImgSpec.setAttribute("height", String(height));
    feImgSpec.setAttribute("preserveAspectRatio", "none");
    feImgSpec.setAttribute("result", "specular_layer");
    f.appendChild(feImgSpec);

    // fade specular alpha
    const feTrans = document.createElementNS(svgNS, "feComponentTransfer");
    feTrans.setAttribute("in", "specular_layer");
    feTrans.setAttribute("result", "specular_faded");
    const feFuncA = document.createElementNS(svgNS, "feFuncA");
    feFuncA.setAttribute("type", "linear");
    feFuncA.setAttribute("slope", String(specularOpacity)); // 0..1
    feTrans.appendChild(feFuncA);
    f.appendChild(feTrans);

    // slight blur for bloom
    const feSpecBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feSpecBlur.setAttribute("in", "specular_faded");
    feSpecBlur.setAttribute("stdDeviation", "0.6");
    feSpecBlur.setAttribute("result", "specular_bloom");
    f.appendChild(feSpecBlur);

    // composite specular mask to ring only
    const feComp = document.createElementNS(svgNS, "feComposite");
    feComp.setAttribute("in", "displaced_saturated");
    feComp.setAttribute("in2", "specular_bloom");
    feComp.setAttribute("operator", "in");
    feComp.setAttribute("result", "specular_masked");
    f.appendChild(feComp);

    // add specular to base using screen (gives highlight)
    const feBlendScreen = document.createElementNS(svgNS, "feBlend");
    feBlendScreen.setAttribute("in", "specular_masked");
    feBlendScreen.setAttribute("in2", "displaced");
    feBlendScreen.setAttribute("mode", "screen");
    feBlendScreen.setAttribute("result", "withSpecular");
    f.appendChild(feBlendScreen);

    // final normal blend for saturation layer over base (preserve hue pop)
    const feBlendFinal = document.createElementNS(svgNS, "feBlend");
    feBlendFinal.setAttribute("in", "specular_faded");
    feBlendFinal.setAttribute("in2", "withSpecular");
    feBlendFinal.setAttribute("mode", "normal");
    f.appendChild(feBlendFinal);

    defs.appendChild(f);
    return f;
}

