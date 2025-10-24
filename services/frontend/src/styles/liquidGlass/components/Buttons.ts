// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Buttons.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:13:20 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:23:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// buttons.ts
import { MotionValue, useTransform } from "../lib/motion";
import {
    ConvexCirclePath24,
    ConvexPath24,
    ConcavePath24,
    LipPath24,
} from "./generateFunctionPath";

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function cx(...parts: Array<string | false | null | undefined>): string {
    return parts.filter(Boolean).join(" ");
}

const baseBtn =
    "btn group relative inline-flex items-center justify-center bg-slate-500/70 text-white/80 p-3 rounded-full hover:bg-slate-600/80 active:bg-slate-700/90 transition-colors";

// ---------------------------------------------------------------------------
// Generic SVG surface icon
// ---------------------------------------------------------------------------

export function createSurfaceIcon(path: string): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    svg.appendChild(p);
    svg.classList.add("icon");
    return svg;
}

// ---------------------------------------------------------------------------
// Base button generator (replaces SurfaceButtonBase)
// ---------------------------------------------------------------------------

export type ButtonOptions = {
    title?: string;
    onClick?: () => void;
    active?: boolean | MotionValue<boolean>;
    ringOpacity?: MotionValue<number>;
    className?: string;
    iconPath?: string;
};

export function createSurfaceButton({
    title,
    onClick,
    active,
    ringOpacity,
    className,
    iconPath,
}: ButtonOptions): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = cx(baseBtn, className);
    if (title) btn.title = title;
    btn.addEventListener("click", () => onClick?.());

    const icon = createSurfaceIcon(iconPath ?? "");
    btn.appendChild(icon);

    // reactive ring highlight
    const ring = document.createElement("span");
    ring.className =
        "absolute inset-0 rounded-full ring-2 ring-blue-400/70 pointer-events-none";
    ring.style.opacity = "0";
    btn.appendChild(ring);

    const setRingOpacity = (v: number) => (ring.style.opacity = String(v));

    if (ringOpacity instanceof MotionValue) {
        ringOpacity.onChange(setRingOpacity);
    } else if (active instanceof MotionValue) {
        const derived = useTransform(active, (v) => (v ? 1 : 0));
        derived.onChange(setRingOpacity);
    } else if (active === true) {
        setRingOpacity(1);
    }

    return btn;
}

// ---------------------------------------------------------------------------
// Specific shape buttons
// ---------------------------------------------------------------------------

export const ConvexCircleButton = (opts: ButtonOptions = {}) =>
    createSurfaceButton({
        ...opts,
        title: opts.title ?? "Convex Circle",
        iconPath: ConvexCirclePath24,
    });

export const ConvexSquircleButton = (opts: ButtonOptions = {}) =>
    createSurfaceButton({
        ...opts,
        title: opts.title ?? "Convex Squircle",
        iconPath: ConvexPath24,
    });

export const ConcaveButton = (opts: ButtonOptions = {}) =>
    createSurfaceButton({
        ...opts,
        title: opts.title ?? "Concave",
        iconPath: ConcavePath24,
    });

export const LipButton = (opts: ButtonOptions = {}) =>
    createSurfaceButton({
        ...opts,
        title: opts.title ?? "Lip",
        iconPath: LipPath24,
    });

// ---------------------------------------------------------------------------
// Replay button (vanilla version of ReplayButton)
// ---------------------------------------------------------------------------

export function createReplayButton(
    sequence: () => Generator<void, void, unknown> | (() => void),
    opts: { className?: string } = {}
): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = cx(baseBtn, opts.className);
    btn.title = "Replay";

    const iconPlay = document.createElement("span");
    iconPlay.textContent = "⟳"; // simple fallback icon
    const iconStop = document.createElement("span");
    iconStop.textContent = "■";
    btn.appendChild(iconPlay);

    let playing = false;

    btn.addEventListener("click", () => {
        if (playing) {
            playing = false;
            btn.replaceChildren(iconPlay);
        } else {
            playing = true;
            btn.replaceChildren(iconStop);
            const maybeGen = sequence();
            if (typeof maybeGen === "function") maybeGen();
            if (maybeGen && "next" in maybeGen) {
                const loop = () => {
                    if (!playing) return;
                    const done = (maybeGen as Generator).next().done;
                    if (!done) requestAnimationFrame(loop);
                    else {
                        playing = false;
                        btn.replaceChildren(iconPlay);
                    }
                };
                loop();
            }
        }
    });

    return btn;
}
