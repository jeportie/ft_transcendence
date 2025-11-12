// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   togglePasswordSvg.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:24:45 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 15:15:55 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "@system/core/dom/dom.js";
import { resolveElement } from "@system/core/dom/resolveElement.js";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[TooglePwdSvg]");

interface TogglePasswordParams {
    ASSETS: { showIcon: string; hideIcon: string }; // paths to SVG files
    addCleanup?: (fn: () => void) => void;
    input?: HTMLInputElement | null;
    getInput?: () => HTMLInputElement | null;
    inputSelector?: string;
}

export function togglePasswordSvg(params: TogglePasswordParams) {
    const { ASSETS, addCleanup, input, getInput, inputSelector } = params;

    const targetInput = resolveElement<HTMLInputElement>({
        el: input,
        getEl: getInput,
        selector: inputSelector,
    });

    if (!targetInput) {
        log.warn("No target input found");
        return;
    }

    const wrapper = create("div", "relative w-full");
    targetInput.parentNode?.insertBefore(wrapper, targetInput);
    wrapper.appendChild(targetInput);

    const btn = create(
        "button",
        "absolute inset-y-0 right-3 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
    );
    btn.type = "button";

    // --- Create container for the SVG
    const iconWrap = create("span", "inline-flex w-5 h-5") as HTMLSpanElement;
    btn.appendChild(iconWrap);
    wrapper.appendChild(btn);


    function loadSVG(svgOrPath: string) {
        if (svgOrPath.trim().startsWith("<svg")) {
            // Inline markup directly
            iconWrap.innerHTML = svgOrPath;
            const svg = iconWrap.querySelector("svg");
            if (svg) {
                svg.style.pointerEvents = "none";
            }
            return;
        }

        // Otherwise, treat it as a URL
        fetch(svgOrPath)
            .then(res => res.text())
            .then(text => {
                iconWrap.innerHTML = text;
                const svg = iconWrap.querySelector("svg");
                if (svg) {
                    svg.style.pointerEvents = "none";
                }
            })
            .catch(err => log.error("Failed to load SVG:", svgOrPath, err));
    }


    // Initial state
    let visible = false;
    loadSVG(ASSETS.showIcon);

    const onClick = async (e: MouseEvent) => {
        e.preventDefault();
        visible = !visible;
        targetInput.type = visible ? "text" : "password";
        await loadSVG(visible ? ASSETS.hideIcon : ASSETS.showIcon);
    };

    btn.addEventListener("click", onClick);

    addCleanup?.(() => {
        btn.removeEventListener("click", onClick);
        wrapper.parentNode?.insertBefore(targetInput, wrapper);
        wrapper.remove();
    });
}

