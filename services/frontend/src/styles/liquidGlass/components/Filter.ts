// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Filter.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:20:05 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:20:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { MotionValue, useTransform } from "../lib/motion"; // <- your vanilla Motion system
import { getValueOrMotion } from "../lib/useValueOrMotion"; // same names as you asked

// All these are already implemented in your /lib, per your note:
import {
    calculateDisplacementMap,
    calculateDisplacementMap2,
} from "../lib/displacementMap";
import { calculateMagnifyingDisplacementMap } from "../lib/magnifyingDisplacement";
import { calculateRefractionSpecular } from "../lib/specular";
import { CONVEX } from "../lib/surfaceEquations";

// ---------- Types ----------

export type SurfaceFn = (x: number) => number;

export type FilterProps = {
    id: string;
    withSvgWrapper?: boolean;
    scaleRatio?: MotionValue<number> | number;
    canvasWidth?: number | MotionValue<number>;
    canvasHeight?: number | MotionValue<number>;
    blur: number | MotionValue<number>;
    width: number | MotionValue<number>;
    height: number | MotionValue<number>;
    radius: number | MotionValue<number>;
    glassThickness: number | MotionValue<number>;
    bezelWidth: number | MotionValue<number>;
    refractiveIndex: number | MotionValue<number>;
    specularOpacity: number | MotionValue<number>;
    specularSaturation?: number | MotionValue<number>;
    magnifyingScale?: number | MotionValue<number>;
    colorScheme?: MotionValue<"light" | "dark">;
    dpr?: number;
    bezelHeightFn?: SurfaceFn;
};

// ---------- Utils ----------

function imageDataToUrl(imageData: ImageData): string {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function svgEl<K extends keyof SVGElementTagNameMap>(
    tag: K
): SVGElementTagNameMap[K] {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function setAttr(el: Element, name: string, v: string | number | undefined) {
    if (v === undefined || v === null) return;
    el.setAttribute(name, String(v));
}

function bindAttr<T>(
    el: Element,
    attr: string,
    mv: MotionValue<T>,
    map: (v: T) => string | number = (v) => (v as unknown as number)
) {
    // set initial
    setAttr(el, attr, map(mv.get()));
    // subscribe updates
    mv.onChange((v) => setAttr(el, attr, map(v)));
}

// Helper to coerce number or MotionValue<number> into MotionValue<number>
function asMotionNumber(v: number | MotionValue<number>): MotionValue<number> {
    return v instanceof MotionValue ? v : new MotionValue(v);
}

// ---------- Main factory ----------

/**
 * Creates the SVG filter (optionally wrapped in <svg><defs/>).
 * Returns the created element (SVGSVGElement if withSvgWrapper=true, otherwise SVGFilterElement).
 */
export function createRefractionFilter(props: FilterProps): SVGSVGElement | SVGFilterElement {
    const {
        id,
        withSvgWrapper = true,
        canvasWidth,
        canvasHeight,
        width,
        height,
        radius,
        blur,
        glassThickness,
        bezelWidth,
        refractiveIndex,
        scaleRatio = 1,
        specularOpacity,
        specularSaturation = 4,
        magnifyingScale,
        colorScheme,
        bezelHeightFn = CONVEX.fn,
        dpr,
    } = props;

    // Coerce to MotionValues where needed
    const mvWidth = asMotionNumber(width);
    const mvHeight = asMotionNumber(height);
    const mvCanvasW = asMotionNumber(canvasWidth ?? mvWidth);
    const mvCanvasH = asMotionNumber(canvasHeight ?? mvHeight);
    const mvRadius = asMotionNumber(radius);
    const mvBlur = asMotionNumber(blur);
    const mvGlassThickness = asMotionNumber(glassThickness);
    const mvBezelWidth = asMotionNumber(bezelWidth);
    const mvRefrIdx = asMotionNumber(refractiveIndex);
    const mvSpecularOpacity = asMotionNumber(specularOpacity);
    const mvSpecularSat = asMotionNumber(specularSaturation);
    const mvScaleRatio = asMotionNumber(scaleRatio);

    // -------- Derived computations (match React version) --------

    // 1) Map of scalar displacements along the 1D bezel profile
    const mapMV = useTransform(
        () =>
            calculateDisplacementMap(
                getValueOrMotion(mvGlassThickness),
                getValueOrMotion(mvBezelWidth),
                bezelHeightFn,
                getValueOrMotion(mvRefrIdx)
            )
    );

    // 2) Maximum absolute displacement
    const maximumDisplacement = useTransform(() => {
        const arr = mapMV.get();
        if (!arr.length) return 0;
        let m = 0;
        for (let i = 0; i < arr.length; i++) {
            const a = Math.abs(arr[i]);
            if (a > m) m = a;
        }
        return m;
    });

    // 3) Main displacement map (ImageData)
    const displacementMapMV = useTransform(() =>
        calculateDisplacementMap2(
            getValueOrMotion(mvCanvasW),
            getValueOrMotion(mvCanvasH),
            getValueOrMotion(mvWidth),
            getValueOrMotion(mvHeight),
            getValueOrMotion(mvRadius),
            getValueOrMotion(mvBezelWidth),
            getValueOrMotion(maximumDisplacement),
            getValueOrMotion(mapMV),
            dpr
        )
    );

    // 4) Specular layer (ImageData)
    const specularLayerMV = useTransform(() =>
        calculateRefractionSpecular(
            getValueOrMotion(mvWidth),
            getValueOrMotion(mvHeight),
            getValueOrMotion(mvRadius),
            50,
            undefined,
            dpr
        )
    );

    // 5) Optional magnifying displacement map (ImageData | undefined)
    const magnifyingDisplacementMapMV = useTransform(() => {
        if (magnifyingScale !== undefined) {
            return calculateMagnifyingDisplacementMap(
                getValueOrMotion(mvCanvasW),
                getValueOrMotion(mvCanvasH)
            );
        }
        return undefined;
    });

    // 6) Data URLs for feImage hrefs
    const magnifyingDispUrl = useTransform(() => {
        const md = magnifyingDisplacementMapMV.get();
        return md ? imageDataToUrl(md) : undefined;
    });
    const displacementUrl = useTransform(() => imageDataToUrl(displacementMapMV.get()));
    const specularUrl = useTransform(() => imageDataToUrl(specularLayerMV.get()));

    // 7) Effective scale = maximumDisplacement * scaleRatio
    const scaleMV = useTransform(
        () => maximumDisplacement.get() * mvScaleRatio.get()
    );

    // ---------- Build DOM ----------

    const filter = svgEl("filter");
    setAttr(filter, "id", id);

    // (Optional) magnifying pre-pass
    let feImageMagnify: SVGFEImageElement | null = null;
    let feDispMagnify: SVGFEDisplacementMapElement | null = null;

    const hasMagnify = magnifyingScale !== undefined;
    if (hasMagnify) {
        feImageMagnify = svgEl("feImage");
        setAttr(feImageMagnify, "x", 0);
        setAttr(feImageMagnify, "y", 0);
        bindAttr(feImageMagnify, "width", mvCanvasW);
        bindAttr(feImageMagnify, "height", mvCanvasH);
        setAttr(feImageMagnify, "result", "magnifying_displacement_map");

        // Bind href to magnifyingDispUrl
        magnifyingDispUrl.onChange((url) => {
            if (url) feImageMagnify!.setAttribute("href", url);
        });
        // set initial if present
        const initMagUrl = magnifyingDispUrl.get();
        if (initMagUrl) feImageMagnify.setAttribute("href", initMagUrl);

        filter.appendChild(feImageMagnify);

        feDispMagnify = svgEl("feDisplacementMap");
        setAttr(feDispMagnify, "in", "SourceGraphic");
        setAttr(feDispMagnify, "in2", "magnifying_displacement_map");
        setAttr(feDispMagnify, "xChannelSelector", "R");
        setAttr(feDispMagnify, "yChannelSelector", "G");
        setAttr(feDispMagnify, "result", "magnified_source");

        // bind scale to magnifyingScale
        bindAttr(feDispMagnify, "scale", asMotionNumber(magnifyingScale as number | MotionValue<number>));
        filter.appendChild(feDispMagnify);
    }

    // (Optional) color matrix for brightness/saturation tweak depending on scheme
    let feBrighten: SVGFEColorMatrixElement | null = null;
    if (colorScheme) {
        feBrighten = svgEl("feColorMatrix");
        setAttr(
            feBrighten,
            "in",
            hasMagnify ? "magnified_source" : "SourceGraphic"
        );
        setAttr(feBrighten, "type", "matrix");

        // Derived values string
        const brightenValues = useTransform(() =>
            (colorScheme.get() === "dark")
                // slightly darker / colder
                ? "0.9 0 0 0 -0.3  0 0.9 0 0 -0.3  0 0 0.9 0 -0.3  0 0 0 1 0"
                // slightly brighter / warmer
                : "1.03 0 0 0 0.2  0 1.03 0 0 0.2  0 0 1.03 0 0.2  0 0 0 1 0"
        );
        bindAttr(feBrighten, "values", brightenValues, String);
        setAttr(feBrighten, "result", "brightened_source");
        filter.appendChild(feBrighten);
    }

    // Gaussian blur
    const feBlur = svgEl("feGaussianBlur");
    setAttr(
        feBlur,
        "in",
        feBrighten
            ? "brightened_source"
            : hasMagnify
                ? "magnified_source"
                : "SourceGraphic"
    );
    bindAttr(feBlur, "stdDeviation", mvBlur);
    setAttr(feBlur, "result", "blurred_source");
    filter.appendChild(feBlur);

    // feImage for main displacement map
    const feImageDisp = svgEl("feImage");
    setAttr(feImageDisp, "x", 0);
    setAttr(feImageDisp, "y", 0);
    bindAttr(feImageDisp, "width", mvCanvasW);
    bindAttr(feImageDisp, "height", mvCanvasH);
    setAttr(feImageDisp, "result", "displacement_map");
    displacementUrl.onChange((url) => feImageDisp.setAttribute("href", url));
    feImageDisp.setAttribute("href", displacementUrl.get());
    filter.appendChild(feImageDisp);

    // Displacement pass
    const feDisp = svgEl("feDisplacementMap");
    setAttr(feDisp, "in", "blurred_source");
    setAttr(feDisp, "in2", "displacement_map");
    setAttr(feDisp, "xChannelSelector", "R");
    setAttr(feDisp, "yChannelSelector", "G");
    setAttr(feDisp, "result", "displaced");
    bindAttr(feDisp, "scale", scaleMV);
    filter.appendChild(feDisp);

    // Satuation of displaced result
    const feSaturate = svgEl("feColorMatrix");
    setAttr(feSaturate, "in", "displaced");
    setAttr(feSaturate, "type", "saturate");
    bindAttr(feSaturate, "values", mvSpecularSat, (v) => String(v));
    setAttr(feSaturate, "result", "displaced_saturated");
    filter.appendChild(feSaturate);

    // Specular layer image
    const feImageSpecular = svgEl("feImage");
    setAttr(feImageSpecular, "x", 0);
    setAttr(feImageSpecular, "y", 0);
    bindAttr(feImageSpecular, "width", mvCanvasW);
    bindAttr(feImageSpecular, "height", mvCanvasH);
    setAttr(feImageSpecular, "result", "specular_layer");
    specularUrl.onChange((url) => feImageSpecular.setAttribute("href", url));
    feImageSpecular.setAttribute("href", specularUrl.get());
    filter.appendChild(feImageSpecular);

    // Compose specular into displaced_saturated
    const feComp = svgEl("feComposite");
    setAttr(feComp, "in", "displaced_saturated");
    setAttr(feComp, "in2", "specular_layer");
    setAttr(feComp, "operator", "in");
    setAttr(feComp, "result", "specular_saturated");
    filter.appendChild(feComp);

    // Fade specular with opacity (feComponentTransfer)
    const feCT = svgEl("feComponentTransfer");
    setAttr(feCT, "in", "specular_layer");
    setAttr(feCT, "result", "specular_faded");

    const feFuncA = svgEl("feFuncA");
    setAttr(feFuncA, "type", "linear");
    // bind slope to specularOpacity
    bindAttr(feFuncA, "slope", mvSpecularOpacity);
    feCT.appendChild(feFuncA);
    filter.appendChild(feCT);

    // Blend (specular_saturated over displaced)
    const feBlend1 = svgEl("feBlend");
    setAttr(feBlend1, "in", "specular_saturated");
    setAttr(feBlend1, "in2", "displaced");
    setAttr(feBlend1, "mode", "normal");
    setAttr(feBlend1, "result", "withSaturation");
    filter.appendChild(feBlend1);

    const feBlend2 = svgEl("feBlend");
    setAttr(feBlend2, "in", "specular_faded");
    setAttr(feBlend2, "in2", "withSaturation");
    setAttr(feBlend2, "mode", "normal");
    filter.appendChild(feBlend2);

    // Wrap in <svg><defs> if asked (to mimic your React wrapper)
    if (withSvgWrapper) {
        const svg = svgEl("svg");
        setAttr(svg, "color-interpolation-filters", "sRGB");
        (svg as SVGSVGElement).style.display = "none";
        const defs = svgEl("defs");
        defs.appendChild(filter);
        svg.appendChild(defs);
        return svg;
    }

    return filter;
}
