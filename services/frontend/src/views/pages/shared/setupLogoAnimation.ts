// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupLogoAnimation.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:34:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 00:10:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { resolveElement } from "../../../spa/utils/resolveElement.js";

interface logoAnimationParams {
    ASSETS: { spaceShipSvg: string };
    card?: HTMLElement | null;
    getCard?: () => HTMLElement | null;
    cardSelector?: string;
}

/**
* Creates and mounts the spaceship logo animation inside a given card element.
*
* @param {Object} params
* @param {Object} params.ASSETS - Contains SVG and other assets.
* @param {Function} [params.getCard] - Callback returning the target card element.
* @param {string} [params.cardSelector] - Fallback CSS selector if getCard is not provided.
* @returns {{ logo: { fadeAndReplaceWithLottie: () => void } }}
*/

let __lottieBootstrapped = false;
function ensureLottieWebComponent() {
    if (__lottieBootstrapped) return;
    if (!document.querySelector('script[src*="dotlottie-wc"],link[href*="dotlottie-wc"]')) {
        const s = document.createElement("script");
        s.type = "module";
        s.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js";
        document.head.appendChild(s);
    }
    __lottieBootstrapped = true;
}

export function setupLogoAnimation({
    ASSETS,
    card,
    getCard,
    cardSelector = "#login-card",
}: logoAnimationParams) {
    const targetCard = resolveElement<HTMLElement>({
        el: card,
        getEl: getCard,
        selector: cardSelector,
    });

    if (!targetCard) {
        console.warn("[setupLogoAnimation] No target card found");
        return {};
    }

    ensureLottieWebComponent();

    const logoContainer = document.createElement("div");
    logoContainer.className = "relative mx-auto mb-4 w-[120px] h-[120px] flex items-center justify-center";

    const staticLogo = document.createElement("div");
    staticLogo.innerHTML = ASSETS.spaceShipSvg;
    staticLogo.className =
        "absolute inset-0 opacity-90 transition-opacity duration-300 flex items-center justify-center";
    staticLogo.querySelector("svg")?.classList.add("w-full", "h-full");

    logoContainer.appendChild(staticLogo);
    targetCard.prepend(logoContainer);

    const logo = {
        fadeAndReplaceWithLottie() {
            const animWrapper = document.createElement("div");
            animWrapper.innerHTML = `
                <dotlottie-wc
                    src="https://lottie.host/ffd0055c-8d94-4608-8a8d-4a97fd97a035/WUB7J2v2eu.lottie"
                    style="width:100%;height:100%;"
                    autoplay loop>
                </dotlottie-wc>
            `;
            animWrapper.className =
                "absolute inset-0 opacity-0 transition-opacity duration-500 flex items-center justify-center";

            staticLogo.classList.replace("opacity-90", "opacity-0");
            setTimeout(() => staticLogo.remove(), 150);
            logoContainer.appendChild(animWrapper);
            setTimeout(() => animWrapper.classList.add("opacity-90"), 10);
        },
    };

    return { logo };
}
